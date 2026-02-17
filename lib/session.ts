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
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
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

  if (!session?.value) {
    return null;
  }

  try {
    return parseInt(session.value, 10);
  } catch {
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
export async function getUserWithRole(
  env?: any,
): Promise<{ id: number; role: string } | null> {
  const userId = await getSessionUserId();
  console.log("getUserWithRole: userId from session:", userId);

  if (!userId) return null;

  try {
    const { getDB } = require("@/lib/db");
    const { users } = require("@/lib/schema");
    const { eq } = require("drizzle-orm");

    const db = getDB(env || process.env);

    const user = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    console.log("getUserWithRole: user from database:", user[0]);

    return user[0] || null;
  } catch (error) {
    console.error("getUserWithRole error:", error);
    return null;
  }
}
