/**
 * Rate limiter using Supabase PostgreSQL
 * Tracks login attempts per identifier (IP or email)
 */

import { getDB } from "@/lib/db";
import { eq, gt, and, lt } from "drizzle-orm";

export interface RateLimitConfig {
	windowMs: number; // Time window in milliseconds
	maxRequests: number; // Max requests per window
}

const DEFAULT_CONFIG: RateLimitConfig = {
	windowMs: 15 * 60 * 1000, // 15 minutes
	maxRequests: 5,
};

export interface RateLimitResult {
	isLimited: boolean;
	attemptsRemaining: number;
	resetTime: number; // Unix timestamp in ms
}

/**
 * Check rate limit status and record attempt
 * Uses Supabase PostgreSQL table
 */
export async function checkRateLimit(
	identifier: string,
	config: RateLimitConfig = DEFAULT_CONFIG,
): Promise<RateLimitResult> {
	if (!identifier) {
		return {
			isLimited: false,
			attemptsRemaining: config.maxRequests,
			resetTime: Date.now() + config.windowMs,
		};
	}

	try {
		const db = getDB(process.env);

		// Import table from schema
		const { loginAttempts } = await import("@/lib/schema");

		const now = new Date();
		const windowStart = new Date(now.getTime() - config.windowMs);

		// Query attempts in the time window using proper Drizzle syntax
		const attempts = await db
			.select()
			.from(loginAttempts)
			.where(
				and(
					eq(loginAttempts.identifier, identifier),
					gt(loginAttempts.attemptedAt, windowStart),
				),
			);

		const attemptCount = attempts.length;
		const isLimited = attemptCount >= config.maxRequests;

		// Record new attempt only if not already over limit
		if (!isLimited) {
			await db.insert(loginAttempts).values({
				identifier,
				attemptedAt: now,
			});
		}

		const attemptsRemaining = Math.max(
			0,
			config.maxRequests - attemptCount - (isLimited ? 0 : 1),
		);
		const resetTime = windowStart.getTime() + config.windowMs;

		return {
			isLimited,
			attemptsRemaining,
			resetTime,
		};
	} catch (error) {
		console.error("[Rate Limit Error] checkRateLimit failed:", error);
		// Fail closed: block requests if service is down (safe default)
		return {
			isLimited: true,
			attemptsRemaining: 0,
			resetTime: Date.now() + 60 * 1000, // 1 minute
		};
	}
}

/**
 * Reset rate limit for an identifier (e.g., on successful login)
 */
export async function resetRateLimit(identifier: string): Promise<void> {
	if (!identifier) return;

	try {
		const db = getDB(process.env);
		const { loginAttempts } = await import("@/lib/schema");

		// Delete all attempts for this identifier
		await db
			.delete(loginAttempts)
			.where(eq(loginAttempts.identifier, identifier));
	} catch (error) {}
}

/**
 * Clean up old attempts (older than specified time)
 * Call this periodically via cron job or manually
 */
export async function cleanupOldAttempts(
	olderThanMs: number = 60 * 60 * 1000,
): Promise<void> {
	try {
		const db = getDB(process.env);
		const { loginAttempts } = await import("@/lib/schema");

		const cutoff = new Date(Date.now() - olderThanMs);
		await db.delete(loginAttempts).where(lt(loginAttempts.attemptedAt, cutoff));
	} catch (error) {
		console.error("[Rate Limit Error] Cleanup failed:", error);
	}
}

/**
 * Extract client IP from request headers
 * Try common proxy headers and fallback
 */
export function getClientIP(request: Request): string {
	const ip =
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		request.headers.get("x-real-ip") ||
		request.headers.get("cf-connecting-ip") ||
		request.headers.get("x-appengine-user-ip") ||
		"unknown";

	return ip;
}
