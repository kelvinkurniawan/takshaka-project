CREATE TABLE "page_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_name" text NOT NULL,
	"page_slug" text NOT NULL,
	"page_data" text NOT NULL,
	"created_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE UNIQUE INDEX "page_sections_slug_idx" ON "page_sections" ("page_slug") WHERE "deleted_at" is null;
