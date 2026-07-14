import { cookies } from "next/headers";
import { cache } from "react";

const SESSION_COOKIE_NAME = "auth_session";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Set session cookie with user ID
 */
export async function setSessionCookie(userId: number): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.set(SESSION_COOKIE_NAME, String(userId), {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax", // More permissive for dev/cross-origin requests
		maxAge: SESSION_DURATION / 1000, // Convert to seconds
		path: "/", // Root path so all endpoints can access the cookie
	});
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie(): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Get user ID from session cookie
 */
export async function getSessionUserId(): Promise<number | null> {
	const cookieStore = await cookies();
	const session = cookieStore.get(SESSION_COOKIE_NAME);

	if (!session?.value) return null;

	// parseInt returns NaN (never throws) for non-numeric cookies — treat as no session
	const userId = parseInt(session.value, 10);
	return Number.isNaN(userId) ? null : userId;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
	const userId = await getSessionUserId();
	return userId !== null;
}

/**
 * Get user data with role
 */
// cache(): dedupe the DB lookup within a single request — layout, page, and rbac
// checks all call this per navigation, so without it each admin nav fires N identical queries.
export const getUserWithRole = cache(async (): Promise<{
	id: number;
	name: string;
	email: string;
	role: string;
} | null> => {
	const userId = await getSessionUserId();
	if (!userId) return null;

	try {
		// Dynamically import to avoid bundling issues
		const { getDB } = await import("@/lib/db");
		const { users } = await import("@/lib/schema");
		const { eq } = await import("drizzle-orm");

		const db = getDB(process.env);

		const userList = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				role: users.role,
			})
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		return userList[0] || null;
	} catch (error) {
		console.error("getUserWithRole error:", error);
		return null;
	}
});
