import crypto from "crypto";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { cache } from "react";
import { getDB } from "@/lib/db";
import { sessions, users } from "@/lib/schema";

export const SESSION_COOKIE_NAME = "auth_session";
export const SESSION_DURATION = 24 * 60 * 60 * 1000;

function hashSessionToken(token: string): string {
	return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: number): Promise<string> {
	const token = crypto.randomBytes(32).toString("hex");
	const now = new Date();

	await getDB(process.env).insert(sessions).values({
		tokenHash: hashSessionToken(token),
		userId,
		expiresAt: new Date(now.getTime() + SESSION_DURATION),
		createdAt: now,
	});

	return token;
}

export function sessionCookieHeader(token: string): string {
	const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
	return `${SESSION_COOKIE_NAME}=${token}; Path=/; Max-Age=${SESSION_DURATION / 1000}; HttpOnly; SameSite=Lax${secure}`;
}

export async function clearSessionCookie(): Promise<void> {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

	if (token) {
		await getDB(process.env)
			.delete(sessions)
			.where(eq(sessions.tokenHash, hashSessionToken(token)));
	}

	cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionUserId(): Promise<number | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

	if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;

	const session = await getDB(process.env)
		.select({ userId: sessions.userId })
		.from(sessions)
		.where(
			and(
				eq(sessions.tokenHash, hashSessionToken(token)),
				gt(sessions.expiresAt, new Date()),
			),
		)
		.limit(1);

	return session[0]?.userId ?? null;
}

export async function isAuthenticated(): Promise<boolean> {
	return (await getSessionUserId()) !== null;
}

export const getUserWithRole = cache(async (): Promise<{
	id: number;
	name: string;
	email: string;
	role: string;
} | null> => {
	const userId = await getSessionUserId();
	if (!userId) return null;

	try {
		const userList = await getDB(process.env)
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
