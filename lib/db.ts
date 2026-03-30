import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

declare global {
	var _db: any;
	var _pool: Pool;
}

export function getDB(env: NodeJS.ProcessEnv) {
	if (global._db) return global._db;

	// ✅ Use env parameter first (for Vercel/production), fallback to process.env
	const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL;
	console.log("DB URL from env:", env.DATABASE_URL ? "✅ Set" : "❌ Not set");
	console.log(
		"DB URL from process.env:",
		process.env.DATABASE_URL ? "✅ Set" : "❌ Not set",
	);

	if (!databaseUrl) {
		throw new Error(
			"DATABASE_URL tidak ditemukan. Pastikan sudah set di .env.local atau .env.production atau Vercel Environment Variables",
		);
	}

	// Buat koneksi PostgreSQL dengan optimized pool configuration
	const pool = new Pool({
		connectionString: databaseUrl,
		max: 10, // Reduced to respect Supabase connection limits
		idleTimeoutMillis: 5000, // Release connections faster during build
		connectionTimeoutMillis: 15000,
		// 🔥 PENTING
		statement_timeout: false,
		query_timeout: 5 * 60 * 1000, //5 minutes
	});
	global._pool = pool;

	// Add event listeners untuk debugging
	pool.on("error", (err) => {
		console.error("Unexpected error on idle client", err);
	});

	pool.on("connect", () => {
		console.log("🟢 NEW DB CONNECTION");
	});

	pool.on("acquire", () => {
		console.log("📥 CONNECTION ACQUIRED");
	});

	const db = drizzle(pool, { schema });
	global._db = db;

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
