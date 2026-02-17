import * as schema from "./schema";

let localDb: any;

export function getDB(env: Record<string, any>) {
  if (process.env.NODE_ENV === "production") {
    // Production: Use D1 binding dari Cloudflare
    if (!env.DB) {
      throw new Error(
        "D1 database binding tidak ditemukan. Pastikan DB binding sudah dikonfigurasi di wrangler.toml.",
      );
    }
    const { drizzle } = require("drizzle-orm/d1");
    return drizzle(env.DB, { schema });
  }

  // Development: Use SQLite untuk development lokal
  if (!localDb) {
    try {
      // Dynamic require untuk menghindari bundling better-sqlite3 di production
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
