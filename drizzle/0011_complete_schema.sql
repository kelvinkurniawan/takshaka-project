-- Drop all existing tables if they exist
DROP TABLE IF EXISTS comment_replies;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS navigation;
DROP TABLE IF EXISTS media_gallery;
DROP TABLE IF EXISTS pages;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS contents;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`password` text NOT NULL,
	`role` text NOT NULL DEFAULT 'editor',
	`created_at` integer NOT NULL,
	`deleted_at` integer
);

-- Create categories table
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`created_by` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);

-- Create contents table
CREATE TABLE `contents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`type` text NOT NULL DEFAULT 'article',
	`category_id` integer,
	`featured_image` text,
	`status` text NOT NULL DEFAULT 'draft',
	`published_at` integer,
	`meta_title` text,
	`meta_description` text,
	`meta_keywords` text,
	`canonical_url` text,
	`robots` text,
	`og_title` text,
	`og_description` text,
	`og_image` text,
	`created_by` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);

-- Create settings table
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL UNIQUE,
	`value` text,
	`type` text NOT NULL DEFAULT 'string',
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

-- Create pages table
CREATE TABLE `pages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text NOT NULL,
	`status` text NOT NULL DEFAULT 'draft',
	`meta_title` text,
	`meta_description` text,
	`created_by` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);

-- Create media_gallery table
CREATE TABLE `media_gallery` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`filename` text NOT NULL,
	`url` text NOT NULL,
	`type` text NOT NULL,
	`original_name` text NOT NULL,
	`file_size` integer NOT NULL,
	`mime_type` text NOT NULL,
	`created_by` integer NOT NULL,
	`created_at` integer NOT NULL,
	`deleted_at` integer
);

-- Create navigation table
CREATE TABLE `navigation` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`url` text NOT NULL,
	`parent_id` integer,
	`order` integer NOT NULL DEFAULT 0,
	`icon` text,
	`target` text DEFAULT '_self',
	`is_active` integer NOT NULL DEFAULT 1,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);

-- Create comments table
CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content_id` integer NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`content` text NOT NULL,
	`status` text NOT NULL DEFAULT 'pending',
	`ip_address` text,
	`user_agent` text,
	`is_spam` integer NOT NULL DEFAULT 0,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);

-- Create comment_replies table
CREATE TABLE `comment_replies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`comment_id` integer NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`content` text NOT NULL,
	`status` text NOT NULL DEFAULT 'pending',
	`ip_address` text,
	`user_agent` text,
	`is_spam` integer NOT NULL DEFAULT 0,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);

-- Create indexes
CREATE INDEX `comments_content_id_idx` ON `comments` (`content_id`);
CREATE INDEX `comments_status_idx` ON `comments` (`status`);
CREATE INDEX `comment_replies_comment_id_idx` ON `comment_replies` (`comment_id`);
CREATE INDEX `comment_replies_status_idx` ON `comment_replies` (`status`);
