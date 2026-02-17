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
