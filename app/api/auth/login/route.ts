import { z } from "zod";
import { verifyPassword } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { users, loginLogs } from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
	checkRateLimit,
	resetRateLimit,
	getClientIP,
} from "@/lib/rate-limiter-supabase";
import { verifyCaptchaToken } from "@/lib/captcha";
import { createSession, sessionCookieHeader } from "@/lib/session";

// Use nodejs runtime to support PostgreSQL database
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const loginSchema = z.object({
	email: z.string().email("Email tidak valid"),
	password: z.string().min(1, "Password tidak boleh kosong"),
	recaptchaToken: z.string().optional(), // Disabled for development
});

// Helper function to log login attempts
async function logLogin(
	db: any,
	email: string,
	success: boolean,
	userId: number | null,
	failureReason: string | null,
	ipAddress: string,
	userAgent?: string,
) {
	try {
		await db.insert(loginLogs).values({
			userId: userId,
			email,
			success,
			failureReason,
			ipAddress,
			userAgent: userAgent || null,
		});
	} catch (error) {
		console.error("Failed to log login attempt:", error);
		// Don't throw - logging failure shouldn't block login
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const clientIP = getClientIP(request);
		const userAgent = request.headers.get("user-agent") || undefined;
		const emailCandidate = body?.email || "";

		// ===== RATE LIMITING (Dual check: IP + Email) =====
		const [ipLimitResult, emailLimitResult] = await Promise.all([
			checkRateLimit(`login_ip:${clientIP}`),
			checkRateLimit(`login_email:${emailCandidate}`),
		]);

		if (ipLimitResult.isLimited || emailLimitResult.isLimited) {
			const resetTime = Math.min(
				ipLimitResult.resetTime,
				emailLimitResult.resetTime,
			);
			const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

			return Response.json(
				{
					error: "Terlalu banyak percobaan. Coba lagi nanti.",
					retryAfter,
				},
				{
					status: 429,
					headers: {
						"Retry-After": String(retryAfter),
					},
				},
			);
		}

		// ===== INPUT VALIDATION =====
		const validatedData = loginSchema.parse(body);

		// ===== RECAPTCHA VERIFICATION (DISABLED FOR DEVELOPMENT) =====

		// ===== DATABASE LOOKUP =====
		const db = getDB(process.env);

		try {
			// Find user by email using Drizzle ORM
			const userResult = await db
				.select({
					id: users.id,
					name: users.name,
					email: users.email,
					password: users.password,
				})
				.from(users)
				.where(eq(users.email, validatedData.email))
				.limit(1);

			const user = userResult[0];

			if (!user) {
				// Log failed login - user not found
				await logLogin(
					db,
					validatedData.email,
					false,
					null,
					"user_not_found",
					clientIP,
					userAgent,
				);
				return Response.json(
					{ error: "Email atau password salah" },
					{ status: 401 },
				);
			}

			// Verify password
			const isPasswordValid = verifyPassword(
				validatedData.password,
				user.password,
			);

			if (!isPasswordValid) {
				// Log failed login - invalid password
				await logLogin(
					db,
					validatedData.email,
					false,
					user.id,
					"invalid_password",
					clientIP,
					userAgent,
				);
				return Response.json(
					{ error: "Email atau password salah" },
					{ status: 401 },
				);
			}

			// Log successful login
			await logLogin(
				db,
				validatedData.email,
				true,
				user.id,
				null,
				clientIP,
				userAgent,
			);

			const sessionToken = await createSession(user.id);

			// Clear rate limit counters on successful login
			await Promise.all([
				resetRateLimit(`login_ip:${clientIP}`),
				resetRateLimit(`login_email:${validatedData.email}`),
			]);

			return new Response(
				JSON.stringify({
					success: true,
					user: {
						id: user.id,
						name: user.name,
						email: user.email,
					},
				}),
				{
					status: 200,
					headers: {
						"Content-Type": "application/json",
						"Set-Cookie": sessionCookieHeader(sessionToken),
					},
				},
			);
		} catch (error) {
			console.error("Database error:", error);
			throw error;
		}
	} catch (error) {
		if (error instanceof z.ZodError) {
			return Response.json(
				{ error: "Validasi gagal", details: error.issues },
				{ status: 400 },
			);
		}

		console.error("Login error:", error);
		return Response.json({ error: "Gagal memproses login" }, { status: 500 });
	}
}
