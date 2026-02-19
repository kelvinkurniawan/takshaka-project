import * as schema from "./schema";

let localDb: any;

export function getDB(env: Record<string, any>) {
	// Production: Use D1 binding from Cloudflare
	if (env?.DB) {
		const { drizzle } = require("drizzle-orm/d1");
		return drizzle(env.DB, { schema });
	}

	// Development or fallback to local SQLite
	if (!localDb) {
		try {
			// Dynamic require to avoid bundling better-sqlite3 in production
			const Database = require("better-sqlite3");
			const betterSqliteDatabase = require("drizzle-orm/better-sqlite3");
			const db = new Database("dev.db");
			localDb = betterSqliteDatabase.drizzle(db, { schema });
		} catch (error) {
			console.error("Database init error:", error);
			throw new Error(
				"better-sqlite3 tidak tersedia. Pastikan sudah install dengan: npm install",
			);
		}
	}

	return localDb;
}
