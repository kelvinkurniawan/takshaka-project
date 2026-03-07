import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";
import { getDB } from "@/lib/db";
import { mediaGallery } from "@/lib/schema";
import { getSessionUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

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
const uploadSchema = z.object({
	type: z.enum(["image", "video"]),
});

// Max file sizes (in bytes)
const MAX_FILE_SIZES = {
	image: 10 * 1024 * 1024, // 10MB for images
	video: 100 * 1024 * 1024, // 100MB for videos
};

// Allowed MIME types
const ALLOWED_TYPES = {
	image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
	video: ["video/mp4", "video/webm", "video/quicktime"],
};

export async function POST(request: Request) {
	try {
		// Get current user
		const userId = await getSessionUserId();
		if (!userId) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Parse form data
		const formData = await request.formData();
		const file = formData.get("file") as File;
		const typeParam = formData.get("type") as string;

		if (!file) {
			return Response.json({ error: "No file provided" }, { status: 400 });
		}

		if (!typeParam) {
			return Response.json(
				{ error: "File type (image or video) is required" },
				{ status: 400 },
			);
		}

		// Validate type
		const validatedType = uploadSchema.safeParse({ type: typeParam });
		if (!validatedType.success) {
			return Response.json(
				{
					error: "Invalid file type. Must be 'image' or 'video'",
					details: validatedType.error.errors,
				},
				{ status: 400 },
			);
		}
		const { type } = validatedType.data;

		// Validate file type
		if (
			!ALLOWED_TYPES[type as keyof typeof ALLOWED_TYPES].includes(file.type)
		) {
			return Response.json(
				{
					error: `Invalid ${type} format. Allowed: ${ALLOWED_TYPES[type as keyof typeof ALLOWED_TYPES].join(", ")}`,
				},
				{ status: 400 },
			);
		}

		// Validate file size
		if (file.size > MAX_FILE_SIZES[type as keyof typeof MAX_FILE_SIZES]) {
			const maxMB =
				MAX_FILE_SIZES[type as keyof typeof MAX_FILE_SIZES] / (1024 * 1024);
			return Response.json(
				{ error: `File size must be less than ${maxMB}MB` },
				{ status: 400 },
			);
		}

		// Generate unique filename
		const timestamp = Date.now();
		const random = Math.random().toString(36).substring(2, 8);
		const ext = file.name.split(".").pop();
		const filename = `${type}s/${timestamp}-${random}.${ext}`;

		// Upload to R2
		const buffer = await file.arrayBuffer();
		const uploadParams = {
			Bucket: process.env.R2_BUCKET_NAME || "",
			Key: filename,
			Body: new Uint8Array(buffer),
			ContentType: file.type,
		};

		await s3Client.send(new PutObjectCommand(uploadParams));

		// Construct public URL
		const publicUrl = `${process.env.R2_PUBLIC_URL}/${filename}`;

		// Save media to database
		const db = getDB();

		const result = await db.insert(mediaGallery).values({
			filename: filename,
			url: publicUrl,
			type: type,
			originalName: file.name,
			fileSize: file.size,
			mimeType: file.type,
			createdBy: userId,
			createdAt: new Date(),
		});

		return Response.json(
			{ success: true, url: publicUrl, filename, mediaId: result.lastID },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Upload error:", error);

		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Invalid request parameters", details: error.issues },
				{ status: 400 },
			);
		}

		if (error instanceof Error && error.message.includes("Unauthorized")) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		return Response.json({ error: "Failed to upload file" }, { status: 500 });
	}
}
