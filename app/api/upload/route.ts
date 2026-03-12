import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { getDB } from "@/lib/db";
import { mediaGallery } from "@/lib/schema";
import { getSessionUserId } from "@/lib/session";

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

// Validation schema
const presignedSchema = z.object({
	fileName: z.string().min(1),
	fileSize: z.number().min(1),
	fileType: z.string().min(1),
});

// Max file sizes (in bytes)
const MAX_FILE_SIZES = {
	image: 10 * 1024 * 1024, // 10MB for images
	video: 100 * 1024 * 1024, // 100MB for videos
};

// GET /api/upload - Generate presigned URL for direct upload to R2
export async function GET(request: Request) {
	try {
		const userId = await getSessionUserId();
		if (!userId) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Parse query parameters
		const url = new URL(request.url);
		const fileName = url.searchParams.get("fileName");
		const fileSizeStr = url.searchParams.get("fileSize");
		const fileType = url.searchParams.get("fileType");

		if (!fileName || !fileSizeStr || !fileType) {
			return Response.json(
				{
					error: "Missing required parameters: fileName, fileSize, fileType",
				},
				{ status: 400 },
			);
		}

		const fileSize = parseInt(fileSizeStr);
		if (isNaN(fileSize)) {
			return Response.json(
				{ error: "Invalid fileSize: must be a number" },
				{ status: 400 },
			);
		}

		// Validate input
		const validatedInput = presignedSchema.safeParse({
			fileName,
			fileSize,
			fileType,
		});

		if (!validatedInput.success) {
			return Response.json(
				{
					error: "Invalid request parameters",
					details: validatedInput.error.issues,
				},
				{ status: 400 },
			);
		}

		// Auto-detect media type
		let type = "image";
		if (fileType.startsWith("video/")) {
			type = "video";
		}

		// Validate file size
		const maxSize = MAX_FILE_SIZES[type as keyof typeof MAX_FILE_SIZES];
		if (fileSize > maxSize) {
			const maxMB = maxSize / (1024 * 1024);
			return Response.json(
				{ error: `File size must be less than ${maxMB}MB` },
				{ status: 400 },
			);
		}

		// Generate unique filename
		const timestamp = Date.now();
		const random = Math.random().toString(36).substring(2, 8);
		const ext = fileName.split(".").pop();
		const s3Key = `${type}s/${timestamp}-${random}.${ext}`;

		// Generate presigned URL valid for 15 minutes
		// Note: Don't include ContentType in the command to avoid signature conflicts
		const presignedUrl = await getSignedUrl(
			s3Client,
			new PutObjectCommand({
				Bucket: process.env.R2_BUCKET_NAME || "",
				Key: s3Key,
			}),
			{ expiresIn: 900 }, // 15 minutes
		);

		const publicUrl = `${process.env.R2_PUBLIC_URL}/${s3Key}`;

		return Response.json(
			{
				presignedUrl,
				publicUrl,
				s3Key,
				type,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error generating presigned URL:", error);
		return Response.json(
			{ error: "Failed to generate upload URL" },
			{ status: 500 },
		);
	}
}

// POST /api/upload - Save file metadata to database after successful upload
export async function POST(request: Request) {
	try {
		const userId = await getSessionUserId();
		if (!userId) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { publicUrl, s3Key, type, fileName, fileSize, fileType } = body;

		if (!publicUrl || !s3Key) {
			return Response.json(
				{ error: "Missing publicUrl or s3Key" },
				{ status: 400 },
			);
		}

		// Save media metadata to database
		const db = getDB();
		const result = await db.insert(mediaGallery).values({
			filename: s3Key,
			url: publicUrl,
			type: type || "image",
			originalName: fileName || s3Key,
			fileSize: fileSize || 0,
			mimeType: fileType || "application/octet-stream",
			createdBy: userId,
			createdAt: new Date(),
		});

		return Response.json(
			{
				success: true,
				url: publicUrl,
				mediaId: result.lastID,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error saving file metadata:", error);
		return Response.json(
			{ error: "Failed to save file metadata" },
			{ status: 500 },
		);
	}
}
