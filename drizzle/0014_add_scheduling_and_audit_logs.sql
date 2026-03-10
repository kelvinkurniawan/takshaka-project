-- Add scheduled_at column to contents table
ALTER TABLE "contents" ADD COLUMN "scheduled_at" timestamp;

-- Add scheduled_at column to pages table
ALTER TABLE "pages" ADD COLUMN "scheduled_at" timestamp;

-- Create audit_logs table
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" integer NOT NULL,
	"entity_name" text,
	"changes" text,
	"old_values" text,
	"new_values" text,
	"metadata" text,
	"created_at" timestamp NOT NULL
);

-- Create indexes for audit_logs table
CREATE INDEX "idx_audit_logs_user_id" ON "audit_logs" ("user_id");
CREATE INDEX "idx_audit_logs_entity" ON "audit_logs" ("entity_type", "entity_id");
CREATE INDEX "idx_audit_logs_created_at" ON "audit_logs" ("created_at");
