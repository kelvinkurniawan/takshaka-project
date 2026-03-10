import { z } from "zod";
import { verifyPassword } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
	checkRateLimit,
	resetRateLimit,
	getClientIP,
} from "@/lib/rate-limiter-supabase";

// Use nodejs runtime to support PostgreSQL database
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const loginSchema = z.object({
	email: z.string().email("Email tidak valid"),
	password: z.string().min(1, "Password tidak boleh kosong"),
});

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const clientIP = getClientIP(request);
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

		// ===== DATABASE LOOKUP =====
		const db = getDB();

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
				return Response.json(
					{ error: "Email atau password salah" },
					{ status: 401 },
				);
			}

			// ===== SUCCESS: Set session cookie via Response headers =====
			console.log(
				`[Auth] Login successful for user ${user.id} (${user.email})`,
			);

			// Calculate cookie expiration
			const maxAge = 24 * 60 * 60; // 24 hours in seconds
			const isProduction = process.env.NODE_ENV === "production";

			// Build Set-Cookie header
			const cookieValue = String(user.id);
			const setCookieHeader = `auth_session=${cookieValue}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${
				isProduction ? "; Secure" : ""
			}`;

			console.log(`[Auth] Setting cookie with header:`, setCookieHeader);

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
						"Set-Cookie": setCookieHeader,
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
