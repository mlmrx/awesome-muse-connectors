CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`entry_id` text NOT NULL,
	`author` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `comments_entry_created` ON `comments` (`entry_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `entries` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`author` text NOT NULL,
	`body` text NOT NULL,
	`protocol` text NOT NULL,
	`endpoint` text NOT NULL,
	`docs_url` text NOT NULL,
	`auth` text NOT NULL,
	`permissions` text NOT NULL,
	`privacy_url` text NOT NULL,
	`terms_url` text NOT NULL,
	`support_url` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `entries_status_created` ON `entries` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `entries_owner` ON `entries` (`owner_id`);--> statement-breakpoint
CREATE TABLE `interactions` (
	`owner_id` text NOT NULL,
	`entry_id` text NOT NULL,
	`type` text NOT NULL,
	PRIMARY KEY(`owner_id`, `entry_id`, `type`)
);
--> statement-breakpoint
CREATE INDEX `interactions_entry_type` ON `interactions` (`entry_id`,`type`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
