-- CreateTable users
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'editor',
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP
);

-- CreateIndex users_email_idx
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");

-- CreateTable categories
CREATE TABLE IF NOT EXISTS "categories" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "created_by" INTEGER NOT NULL,
  "created_at" TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP NOT NULL,
  "deleted_at" TIMESTAMP
);

-- CreateIndex categories_slug_idx
CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories"("slug") WHERE "deleted_at" IS NULL;

-- CreateTable contents
CREATE TABLE IF NOT EXISTS "contents" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "excerpt" TEXT,
  "type" TEXT NOT NULL DEFAULT 'article',
  "category_id" INTEGER,
  "featured_image" TEXT,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "published_at" TIMESTAMP,
  "meta_title" TEXT,
  "meta_description" TEXT,
  "meta_keywords" TEXT,
  "canonical_url" TEXT,
  "robots" TEXT,
  "og_title" TEXT,
  "og_description" TEXT,
  "og_image" TEXT,
  "created_by" INTEGER NOT NULL,
  "created_at" TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP NOT NULL,
  "deleted_at" TIMESTAMP
);

-- CreateIndex contents_slug_idx
CREATE UNIQUE INDEX IF NOT EXISTS "contents_slug_idx" ON "contents"("slug") WHERE "deleted_at" IS NULL;

-- CreateTable settings
CREATE TABLE IF NOT EXISTS "settings" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "key" TEXT NOT NULL,
  "value" TEXT,
  "type" TEXT NOT NULL DEFAULT 'string',
  "description" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex settings_key_idx
CREATE UNIQUE INDEX IF NOT EXISTS "settings_key_idx" ON "settings"("key");

-- CreateTable pages
CREATE TABLE IF NOT EXISTS "pages" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "meta_title" TEXT,
  "meta_description" TEXT,
  "created_by" INTEGER NOT NULL,
  "created_at" TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP NOT NULL,
  "deleted_at" TIMESTAMP
);

-- CreateIndex pages_slug_idx
CREATE UNIQUE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages"("slug") WHERE "deleted_at" IS NULL;

-- CreateTable media_gallery
CREATE TABLE IF NOT EXISTS "media_gallery" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "filename" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "original_name" TEXT NOT NULL,
  "file_size" INTEGER NOT NULL,
  "mime_type" TEXT NOT NULL,
  "created_by" INTEGER NOT NULL,
  "created_at" TIMESTAMP NOT NULL,
  "deleted_at" TIMESTAMP
);

-- CreateTable navigation
CREATE TABLE IF NOT EXISTS "navigation" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "label" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "parent_id" INTEGER,
  "order" INTEGER NOT NULL DEFAULT 0,
  "icon" TEXT,
  "target" TEXT DEFAULT '_self',
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP NOT NULL,
  "deleted_at" TIMESTAMP
);

-- CreateTable comments
CREATE TABLE IF NOT EXISTS "comments" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "content_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "ip_address" TEXT,
  "user_agent" TEXT,
  "is_spam" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP NOT NULL,
  "deleted_at" TIMESTAMP
);

-- CreateTable comment_replies
CREATE TABLE IF NOT EXISTS "comment_replies" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "comment_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "ip_address" TEXT,
  "user_agent" TEXT,
  "is_spam" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP NOT NULL,
  "deleted_at" TIMESTAMP
);
