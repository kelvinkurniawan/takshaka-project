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
