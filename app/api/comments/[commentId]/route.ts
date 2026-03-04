import { z } from "zod";
import { getDB } from "@/lib/db";
import { commentReplies, comments as commentsTable } from "@/lib/schema";
import {
	performSpamCheck,
	checkRateLimit,
	getUserIdentifier,
} from "@/lib/spam-protection/detector";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

const createReplySchema = z.object({
	name: z.string().min(2, "Nama minimal 2 karakter").max(100),
	email: z.string().email("Email tidak valid"),
	content: z.string().min(2, "Balasan minimal 2 karakter").max(5000),
	submissionTime: z.number().positive("Submission time harus valid"),
	honeypot: z.string().optional(),
});

/**
 * GET /api/comments/[commentId] - Get replies for a specific comment
 */
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ commentId: string }> },
) {
	try {
		const { commentId } = await params;

		const db = getDB();

		// Fetch approved replies only
		const allReplies = await db
			.select()
			.from(commentReplies)
			.where(eq(commentReplies.commentId, parseInt(commentId)))
			.orderBy(desc(commentReplies.createdAt));

		const approvedReplies = allReplies.filter(
			(reply: any) =>
				reply.deletedAt === null &&
				reply.status === "approved" &&
				!reply.isSpam,
		);

		return Response.json({
			data: approvedReplies,
			total: approvedReplies.length,
		});
	} catch (error) {
		console.error("Failed to fetch replies:", error);
		return Response.json({ error: "Gagal mengambil balasan" }, { status: 500 });
	}
}

/**
 * POST /api/comments/[commentId] - Create a reply to a comment
 */
export async function POST(
	request: Request,
	{ params }: { params: Promise<{ commentId: string }> },
) {
	try {
		const { commentId } = await params;
		const body = await request.json();

		// Check honeypot
		if (body.honeypot) {
			return Response.json({ error: "Invalid submission" }, { status: 400 });
		}

		// Validate input
		const validatedData = createReplySchema.parse(body);

		const db = getDB();
		const commentIdNum = parseInt(commentId);

		// Verify comment exists and is approved
		const parentComment = await db
			.select()
			.from(commentsTable)
			.where(eq(commentsTable.id, commentIdNum));

		if (parentComment.length === 0) {
			return Response.json(
				{ error: "Komentar tidak ditemukan" },
				{ status: 404 },
			);
		}

		if (
			parentComment[0].deletedAt !== null ||
			parentComment[0].status !== "approved"
		) {
			return Response.json(
				{ error: "Komentar tidak tersedia" },
				{ status: 404 },
			);
		}

		// Get IP address and other request info
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

		// Create reply
		await db.insert(commentReplies).values({
			commentId: commentIdNum,
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
					? "Balasan Anda ditolak karena terdeteksi sebagai spam"
					: "Balasan Anda berhasil dibuat. Menunggu persetujuan moderator.",
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

		console.error("Failed to create reply:", error);
		return Response.json({ error: "Gagal membuat balasan" }, { status: 500 });
	}
}
