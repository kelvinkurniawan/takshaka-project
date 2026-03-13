import { cookies } from "next/headers";

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
	console.log(`[Auth] Session cookie set for user ${userId}`, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: SESSION_DURATION / 1000,
		path: "/",
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

	console.log(
		`[Auth] getSessionUserId - cookie value:`,
		session?.value,
		"- all cookies:",
		cookieStore.getAll(),
	);

	if (!session?.value) {
		console.log(`[Auth] No session cookie found`);
		return null;
	}

	try {
		const userId = parseInt(session.value, 10);
		console.log(`[Auth] Parsed userId from cookie:`, userId);
		return userId;
	} catch {
		console.error(`[Auth] Failed to parse session value:`, session.value);
		return null;
	}
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
export async function getUserWithRole(): Promise<{
	id: number;
	name: string;
	email: string;
	role: string;
} | null> {
	const userId = await getSessionUserId();
	console.log("getUserWithRole: userId from session:", userId);

	if (!userId) return null;

	try {
		// Dynamically import to avoid bundling issues
		const { getDB } = await import("@/lib/db");
		const { users } = await import("@/lib/schema");
		const { eq } = await import("drizzle-orm");

		const db = getDB();

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

		console.log("getUserWithRole: user from database:", userList[0]);

		return userList[0] || null;
	} catch (error) {
		console.error("getUserWithRole error:", error);
		return null;
	}
}
