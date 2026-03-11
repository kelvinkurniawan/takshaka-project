-- Add missing columns to pages table for PostgreSQL
ALTER TABLE "pages" ADD COLUMN "published_at" timestamp;
