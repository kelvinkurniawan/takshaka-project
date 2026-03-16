import {
	S3Client,
	GetObjectCommand,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getDB } from "@/lib/db";
import { mediaGallery } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/rbac";
import sharp from "sharp";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Initialize S3 client for R2
const s3Client = new S3Client({
	region: "auto",
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
	},
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
});

/**
 * POST /api/media-gallery/compress - Compress an image
 */
export async function POST(request: Request) {
	try {
		// Check authorization
		await requireAuth();

		const body = await request.json();
		const { mediaId } = body;

		if (!mediaId) {
			return Response.json({ error: "Media ID is required" }, { status: 400 });
		}

		const db = getDB(process.env);

		// Get media from database
		const media = await db
			.select()
			.from(mediaGallery)
			.where(eq(mediaGallery.id, mediaId));

		if (!media || media.length === 0) {
			return Response.json({ error: "Media not found" }, { status: 404 });
		}

		const mediaItem = media[0];

		// Only compress images
		if (mediaItem.type !== "image") {
			return Response.json(
				{ error: "Only images can be compressed" },
				{ status: 400 },
			);
		}

		// Only compress JPEG, PNG, and WebP
		const compressibleFormats = ["image/jpeg", "image/png", "image/webp"];
		if (!compressibleFormats.includes(mediaItem.mimeType)) {
			return Response.json(
				{ error: "This image format cannot be compressed" },
				{ status: 400 },
			);
		}

		// Download from R2
		const getParams = {
			Bucket: process.env.R2_BUCKET_NAME || "",
			Key: mediaItem.filename,
		};

		let buffer: Buffer;
		try {
			const getResponse = await s3Client.send(new GetObjectCommand(getParams));
			const byteArray = await getResponse.Body?.transformToByteArray();

			if (!byteArray) {
				return Response.json(
					{ error: "Failed to download image from storage" },
					{ status: 500 },
				);
			}

			// Convert Uint8Array to Buffer
			buffer = Buffer.from(byteArray);
			console.log(`Original file size: ${buffer.length} bytes`);
		} catch (error) {
			console.error("Download from R2 error:", error);
			return Response.json(
				{ error: "Failed to download image from storage" },
				{ status: 500 },
			);
		}

		// Compress image using sharp
		let compressedBuffer: Buffer;
		// compress 50% quality for JPEG and WebP, max compression for PNG
		try {
			if (
				mediaItem.mimeType === "image/jpeg" ||
				mediaItem.mimeType === "image/webp"
			) {
				compressedBuffer = await sharp(buffer)
					.toFormat(mediaItem.mimeType === "image/jpeg" ? "jpeg" : "webp", {
						quality: 50,
						progressive: mediaItem.mimeType === "image/jpeg",
					})
					.toBuffer();
			} else if (mediaItem.mimeType === "image/png") {
				compressedBuffer = await sharp(buffer)
					.toFormat("png", {
						compressionLevel: 9,
						adaptiveFiltering: true,
					})
					.toBuffer();
			} else {
				return Response.json(
					{ error: "Unsupported image format" },
					{ status: 400 },
				);
			}

			console.log(`Compressed file size: ${compressedBuffer.length} bytes`);
		} catch (error) {
			console.error("Compression error:", error);
			return Response.json(
				{ error: "Failed to compress image" },
				{ status: 500 },
			);
		}

		// Upload compressed image back to R2
		const putParams = {
			Bucket: process.env.R2_BUCKET_NAME || "",
			Key: mediaItem.filename,
			Body: compressedBuffer,
			ContentType: mediaItem.mimeType,
		};

		try {
			await s3Client.send(new PutObjectCommand(putParams));
		} catch (error) {
			console.error("Upload compression error:", error);
			return Response.json(
				{ error: "Failed to upload compressed image" },
				{ status: 500 },
			);
		}

		// Update database with new file size
		const newFileSize = compressedBuffer.length;
		const compressionRatio = (
			((mediaItem.fileSize - newFileSize) / mediaItem.fileSize) *
			100
		).toFixed(2);

		console.log(`Compression ratio: ${compressionRatio}%`);
		console.log(
			`Original: ${mediaItem.fileSize} bytes, Compressed: ${newFileSize} bytes`,
		);

		await db
			.update(mediaGallery)
			.set({ fileSize: newFileSize })
			.where(eq(mediaGallery.id, mediaId));

		return Response.json({
			success: true,
			message: "Image compressed successfully",
			newFileSize,
			compressionRatio: parseFloat(compressionRatio),
			originalSize: mediaItem.fileSize,
		});
	} catch (error) {
		console.error("Compress media error:", error);

		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		return Response.json(
			{ error: "Failed to compress media" },
			{ status: 500 },
		);
	}
}
