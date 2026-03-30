import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

declare global {
	var _pool: Pool | undefined;
}

export function getDB(env: NodeJS.ProcessEnv) {
	if (!global._pool) {
		const databaseUrl = process.env.DATABASE_URL;

		if (!databaseUrl) {
			throw new Error("DATABASE_URL tidak ditemukan");
		}

		global._pool = new Pool({
			connectionString: databaseUrl,
			max: 5,
			idleTimeoutMillis: 10000,
			connectionTimeoutMillis: 10000,
			ssl: {
				rejectUnauthorized: false,
			},
		});

		global._pool.on("error", (err) => {
			console.error("Pool error:", err);
		});
	}

	return drizzle(global._pool, { schema });
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
