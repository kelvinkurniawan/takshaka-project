import crypto from "crypto";
const SALT_ROUNDS = 10;

/**
 * Hash a password using SHA256 with salt
 */
export function hashPassword(password: string): string {
	const salt = crypto.randomBytes(16).toString("hex");
	const hash = crypto
		.pbkdf2Sync(password, salt, 100000, 64, "sha256")
		.toString("hex");
	return `${salt}:${hash}`;
}

/**
 * Verify a password against its hash
 */
export function verifyPassword(password: string, hash: string): boolean {
	try {
		const [salt, storedHash] = hash.split(":");
		const derivedHash = crypto
			.pbkdf2Sync(password, salt, 100000, 64, "sha256")
			.toString("hex");
		return derivedHash === storedHash;
	} catch (error) {
		return false;
	}
}

/**
 * Generate a session token
 */
export function generateSessionToken(): string {
	return crypto.randomBytes(32).toString("hex");
}
