import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let db: any = null;

export function getDB() {
	if (db) return db;

	const databaseUrl = process.env.DATABASE_URL;

	if (!databaseUrl) {
		throw new Error(
			"DATABASE_URL tidak ditemukan. Pastikan sudah set di .env.local",
		);
	}

	// Buat koneksi PostgreSQL
	const pool = new Pool({
		connectionString: databaseUrl,
	});

	db = drizzle(pool, { schema });

	return db;
}
