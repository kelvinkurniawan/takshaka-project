import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { getDB } from "@/lib/db";
import { mediaGallery } from "@/lib/schema";
import { getSessionUserId } from "@/lib/session";
import crypto from "crypto";

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
	fileName: z.string().min(1).max(255),
	fileSize: z.number().int().positive(),
	fileType: z.enum([
		"image/jpeg",
		"image/png",
		"image/webp",
		"image/gif",
		"video/mp4",
		"video/webm",
	]),
});

const uploadMetadataSchema = presignedSchema.extend({
	s3Key: z.string().min(1),
});

const FILE_TYPES = {
	"image/jpeg": { type: "image", extension: "jpg" },
	"image/png": { type: "image", extension: "png" },
	"image/webp": { type: "image", extension: "webp" },
	"image/gif": { type: "image", extension: "gif" },
	"video/mp4": { type: "video", extension: "mp4" },
	"video/webm": { type: "video", extension: "webm" },
} as const;

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

		const fileDetails = FILE_TYPES[validatedInput.data.fileType];
		const type = fileDetails.type;

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
		const s3Key = `${type}s/${Date.now()}-${crypto.randomBytes(16).toString("hex")}.${fileDetails.extension}`;

		// Generate presigned URL valid for 15 minutes
		const presignedUrl = await getSignedUrl(
			s3Client,
			new PutObjectCommand({
				Bucket: process.env.R2_BUCKET_NAME || "",
				Key: s3Key,
				ContentType: validatedInput.data.fileType,
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

		const validatedInput = uploadMetadataSchema.safeParse(await request.json());
		if (!validatedInput.success) {
			return Response.json(
				{ error: "Invalid upload metadata", details: validatedInput.error.issues },
				{ status: 400 },
			);
		}

		const { fileName, fileSize, fileType, s3Key } = validatedInput.data;
		const fileDetails = FILE_TYPES[fileType];
		const maxSize = MAX_FILE_SIZES[fileDetails.type];
		const keyPattern = new RegExp(
			`^${fileDetails.type}s/\\d+-[a-f0-9]{32}\\.${fileDetails.extension}$`,
		);
		if (fileSize > maxSize || !keyPattern.test(s3Key)) {
			return Response.json({ error: "Invalid upload metadata" }, { status: 400 });
		}

		const publicUrl = `${process.env.R2_PUBLIC_URL?.replace(/\/$/, "")}/${s3Key}`;

		// Save media metadata to database
		const db = getDB(process.env);
		const result = await db.insert(mediaGallery).values({
			filename: s3Key,
			url: publicUrl,
			type: fileDetails.type,
			originalName: fileName,
			fileSize,
			mimeType: fileType,
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
