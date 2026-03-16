import { z } from "zod";
import { getDB } from "@/lib/db";
import { comments as commentsTable } from "@/lib/schema";
import {
	performSpamCheck,
	checkRateLimit,
	getUserIdentifier,
} from "@/lib/spam-protection/detector";
import { eq, desc } from "drizzle-orm";
import { verifyCaptchaToken } from "@/lib/captcha";

export const dynamic = "force-dynamic";

const createCommentSchema = z.object({
	contentId: z.number().int().positive("Content ID harus valid"),
	name: z.string().min(2, "Nama minimal 2 karakter").max(100),
	email: z.string().email("Email tidak valid"),
	content: z.string().min(2, "Komentar minimal 2 karakter").max(5000),
	submissionTime: z.number().positive("Submission time harus valid"),
	honeypot: z.string().optional(), // Anti-bot field
	recaptchaToken: z.string().min(1, "reCAPTCHA token is required"),
});

/**
 * GET /api/comments - Get comments for a content (public API)
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const contentId = searchParams.get("contentId");
		const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
		const offset = parseInt(searchParams.get("offset") || "0");

		if (!contentId) {
			return Response.json({ error: "Content ID diperlukan" }, { status: 400 });
		}

		const db = getDB(process.env);

		// Fetch approved comments only
		const allComments = await db
			.select()
			.from(commentsTable)
			.where(eq(commentsTable.contentId, parseInt(contentId)))
			.orderBy(desc(commentsTable.createdAt));

		// Filter approved comments on the application level
		const approvedComments = allComments.filter(
			(comment: any) =>
				comment.deletedAt === null &&
				comment.status === "approved" &&
				!comment.isSpam,
		);

		const paginatedComments = approvedComments.slice(offset, offset + limit);
		const total = approvedComments.length;

		return Response.json({
			data: paginatedComments,
			total,
			limit,
			offset,
		});
	} catch (error) {
		console.error("Failed to fetch comments:", error);
		return Response.json(
			{ error: "Gagal mengambil komentar" },
			{ status: 500 },
		);
	}
}

/**
 * POST /api/comments - Create a new comment (public API with spam protection)
 */
export async function POST(request: Request) {
	try {
		const body = await request.json();

		// Check honeypot (anti-bot)
		if (body.honeypot) {
			return Response.json({ error: "Invalid submission" }, { status: 400 });
		}

		// Validate input
		const validatedData = createCommentSchema.parse(body);

		// Verify reCAPTCHA token
		const captchaResult = await verifyCaptchaToken(
			validatedData.recaptchaToken,
		);

		if (!captchaResult.success) {
			console.warn(
				"reCAPTCHA verification failed for comment:",
				captchaResult.error,
				"Score:",
				captchaResult.score,
			);
			return Response.json(
				{ error: "reCAPTCHA verification failed. Please try again." },
				{ status: 400 },
			);
		}

		const ipAddress =
			request.headers.get("x-forwarded-for") ||
			request.headers.get("x-real-ip") ||
			"unknown";
		const userAgent = request.headers.get("user-agent") || "";
		const identifier = getUserIdentifier(ipAddress, validatedData.email);

		// Check rate limiting
		const rateCheck = checkRateLimit(identifier);
		if (!rateCheck.allowed) {
			return Response.json({ error: rateCheck.reason }, { status: 429 });
		}

		// Perform spam check
		const spamCheck = await performSpamCheck(
			validatedData.email,
			validatedData.content,
			validatedData.submissionTime,
		);

		const db = getDB(process.env);

		// Create comment
		const result = await db.insert(commentsTable).values({
			contentId: validatedData.contentId,
			name: validatedData.name,
			email: validatedData.email,
			content: validatedData.content,
			status: spamCheck.isSpam ? "rejected" : "pending",
			ipAddress,
			userAgent,
			isSpam: spamCheck.isSpam,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		return Response.json(
			{
				success: true,
				message: spamCheck.isSpam
					? "Komentar Anda ditolak karena terdeteksi sebagai spam"
					: "Komentar Anda berhasil dibuat. Menunggu persetujuan moderator.",
				data: result,
			},
			{ status: 201 },
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validasi gagal", details: error.issues },
				{ status: 400 },
			);
		}

		console.error("Failed to create comment:", error);
		return Response.json({ error: "Gagal membuat komentar" }, { status: 500 });
	}
}
