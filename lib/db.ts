import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let db: any = null;

export function getDB(env: NodeJS.ProcessEnv) {
	if (db) return db;

	// Gunakan DIRECT_URL untuk menghindari pooler issues
	const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

	if (!databaseUrl) {
		throw new Error(
			"DATABASE_URL atau DIRECT_URL tidak ditemukan. Pastikan sudah set di .env.local",
		);
	}

	// Buat koneksi PostgreSQL dengan optimized pool configuration
	const pool = new Pool({
		connectionString: databaseUrl,
		max: 20, // Maximum number of clients in the pool
		idleTimeoutMillis: 30000, // 30 seconds
		connectionTimeoutMillis: 10000, // 10 seconds
	});

	// Add event listeners untuk debugging
	pool.on("error", (err) => {
		console.error("Unexpected error on idle client", err);
	});

	pool.on("connect", () => {
		// Execute initial setup queries when connection is established
		const client = pool;
		// Optionally set session parameters
	});

	db = drizzle(pool, { schema });

	return db;
}

// Helper function untuk reconnect dengan retry logic
export async function withRetry<T>(
	fn: () => Promise<T>,
	maxAttempts = 3,
	delayMs = 500,
): Promise<T> {
	let lastError: any;

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;
			console.warn(
				`Database operation failed (attempt ${attempt}/${maxAttempts}):`,
				error,
			);

			if (attempt < maxAttempts) {
				// Exponential backoff
				await new Promise((resolve) =>
					setTimeout(resolve, delayMs * Math.pow(1.5, attempt - 1)),
				);
			}
		}
	}

	throw lastError;
}
