import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
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
	const client = postgres(databaseUrl);
	db = drizzle(client, { schema });

	return db;
}
