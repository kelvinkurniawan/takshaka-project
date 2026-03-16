import { getDB } from "@/lib/db";
import { comments as commentsTable, commentReplies } from "@/lib/schema";
import { and, eq, gt } from "drizzle-orm";

interface SpamCheckResult {
	isSpam: boolean;
	reason?: string;
	score: number;
}

// Store submission attempts in memory (in production, use Redis or database)
const submissionAttempts = new Map<
	string,
	{ count: number; resetTime: number }
>();

const SPAM_THRESHOLDS = {
	MAX_SUBMISSIONS_PER_HOUR: 5, // 5 submissions per hour per IP/email
	SPAM_KEYWORDS: [
		"viagra",
		"casino",
		"lottery",
		"click here",
		"buy now",
		"bitcoin",
		"cryptocurrency",
		"free money",
		"http://",
		"https://",
		"www.",
	],
	MIN_SUBMISSION_TIME: 3000, // 3 seconds minimum between submissions
};

/**
 * Get user identifier for rate limiting
 */
export function getUserIdentifier(ipAddress: string, email: string): string {
	return `${ipAddress}:${email}`;
}

/**
 * Check rate limiting
 */
export function checkRateLimit(identifier: string): {
	allowed: boolean;
	reason?: string;
} {
	const now = Date.now();
	const attempt = submissionAttempts.get(identifier);

	if (!attempt) {
		submissionAttempts.set(identifier, { count: 1, resetTime: now + 3600000 }); // 1 hour
		return { allowed: true };
	}

	if (now > attempt.resetTime) {
		// Reset if hour has passed
		submissionAttempts.set(identifier, { count: 1, resetTime: now + 3600000 });
		return { allowed: true };
	}

	if (attempt.count >= SPAM_THRESHOLDS.MAX_SUBMISSIONS_PER_HOUR) {
		return {
			allowed: false,
			reason:
				"Terlalu banyak komentar dalam waktu singkat. Silakan coba lagi nanti.",
		};
	}

	attempt.count++;
	return { allowed: true };
}

/**
 * Check submission time validation
 */
export function checkSubmissionTime(submissionTime: number): SpamCheckResult {
	const elapsed = Date.now() - submissionTime;

	if (elapsed < SPAM_THRESHOLDS.MIN_SUBMISSION_TIME) {
		return {
			isSpam: true,
			reason: "Submission too fast",
			score: 0.3,
		};
	}

	return { isSpam: false, score: 0 };
}

/**
 * Check content for spam keywords
 */
export function checkSpamKeywords(content: string): SpamCheckResult {
	const lowerContent = content.toLowerCase();
	const matchedKeywords = SPAM_THRESHOLDS.SPAM_KEYWORDS.filter((keyword) =>
		lowerContent.includes(keyword),
	);

	if (matchedKeywords.length > 0) {
		return {
			isSpam: true,
			reason: `Detected spam keywords: ${matchedKeywords.join(", ")}`,
			score: Math.min(matchedKeywords.length * 0.2, 1),
		};
	}

	return { isSpam: false, score: 0 };
}

/**
 * Check content length
 */
export function checkContentLength(content: string): SpamCheckResult {
	const trimmedContent = content.trim();

	if (trimmedContent.length < 2) {
		return {
			isSpam: true,
			reason: "Content too short",
			score: 0.5,
		};
	}

	if (trimmedContent.length > 5000) {
		return {
			isSpam: true,
			reason: "Content too long",
			score: 0.3,
		};
	}

	return { isSpam: false, score: 0 };
}

/**
 * Check for excessive links
 */
export function checkExcessiveLinks(content: string): SpamCheckResult {
	const urlPattern = /(https?:\/\/|www\.)[^\s]+/gi;
	const matches = content.match(urlPattern) || [];

	if (matches.length > 2) {
		return {
			isSpam: true,
			reason: `Too many links detected: ${matches.length}`,
			score: 0.4,
		};
	}

	return { isSpam: false, score: 0 };
}

/**
 * Check email format and validity
 */
export function checkEmailValidity(email: string): SpamCheckResult {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!emailRegex.test(email)) {
		return {
			isSpam: true,
			reason: "Invalid email format",
			score: 0.5,
		};
	}

	// Check for disposable email domains
	const disposableDomains = [
		"tempmail.com",
		"10minutemail.com",
		"throwaway.email",
	];
	const domain = email.split("@")[1].toLowerCase();

	if (disposableDomains.includes(domain)) {
		return {
			isSpam: true,
			reason: "Disposable email domain",
			score: 0.4,
		};
	}

	return { isSpam: false, score: 0 };
}

/**
 * Check for duplicate submissions
 */
export async function checkDuplicateSubmission(
	email: string,
	content: string,
): Promise<SpamCheckResult> {
	try {
		const db = getDB(process.env);
		const oneHourAgo = new Date(Date.now() - 3600000); // 1 hour ago

		// Check for duplicate comments
		const duplicateComments = await db
			.select()
			.from(commentsTable)
			.where(
				and(
					eq(commentsTable.email, email),
					eq(commentsTable.content, content),
					gt(commentsTable.createdAt, oneHourAgo),
				),
			);

		if (duplicateComments.length > 0) {
			return {
				isSpam: true,
				reason: "Duplicate submission detected",
				score: 0.8,
			};
		}

		// Check for duplicate replies
		const duplicateReplies = await db
			.select()
			.from(commentReplies)
			.where(
				and(
					eq(commentReplies.email, email),
					eq(commentReplies.content, content),
					gt(commentReplies.createdAt, oneHourAgo),
				),
			);

		if (duplicateReplies.length > 0) {
			return {
				isSpam: true,
				reason: "Duplicate submission detected",
				score: 0.8,
			};
		}

		return { isSpam: false, score: 0 };
	} catch (error) {
		console.error("Error checking duplicate submission:", error);
		return { isSpam: false, score: 0 };
	}
}

/**
 * Comprehensive spam check
 */
export async function performSpamCheck(
	email: string,
	content: string,
	submissionTime: number,
): Promise<SpamCheckResult> {
	const checks = [
		checkSubmissionTime(submissionTime),
		checkSpamKeywords(content),
		checkContentLength(content),
		checkExcessiveLinks(content),
		checkEmailValidity(email),
		await checkDuplicateSubmission(email, content),
	];

	// Calculate spam score
	let totalScore = 0;
	const failedChecks: string[] = [];

	for (const check of checks) {
		if (check.isSpam) {
			failedChecks.push(check.reason || "Unknown reason");
			totalScore += check.score;
		}
	}

	// If any critical check fails, mark as spam
	if (failedChecks.length > 0 && totalScore >= 0.5) {
		return {
			isSpam: true,
			reason: failedChecks[0],
			score: Math.min(totalScore, 1),
		};
	}

	return { isSpam: false, score: totalScore };
}
