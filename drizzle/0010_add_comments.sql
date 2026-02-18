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

CREATE INDEX `comments_content_id_idx` ON `comments` (`content_id`);
CREATE INDEX `comments_status_idx` ON `comments` (`status`);
CREATE INDEX `comment_replies_comment_id_idx` ON `comment_replies` (`comment_id`);
CREATE INDEX `comment_replies_status_idx` ON `comment_replies` (`status`);
