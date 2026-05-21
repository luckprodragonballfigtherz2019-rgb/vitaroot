CREATE TABLE `mood_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`score` integer NOT NULL,
	`notes` text,
	`meta` text,
	`source` text DEFAULT 'manual' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_mood_date_unique` ON `mood_logs` (`date`);--> statement-breakpoint
CREATE TABLE `sleep_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`bedtime` integer NOT NULL,
	`wake_time` integer NOT NULL,
	`duration_min` integer NOT NULL,
	`quality` integer,
	`notes` text,
	`meta` text,
	`source` text DEFAULT 'manual' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_sleep_bedtime` ON `sleep_logs` (`bedtime`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_sleep_bedtime_unique` ON `sleep_logs` (`bedtime`);--> statement-breakpoint
CREATE TABLE `water_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`occurred_at` integer NOT NULL,
	`amount_ml` integer NOT NULL,
	`source` text DEFAULT 'manual' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_water_occurred` ON `water_logs` (`occurred_at`);--> statement-breakpoint
CREATE TABLE `weight_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`occurred_at` integer NOT NULL,
	`weight_kg` real NOT NULL,
	`notes` text,
	`meta` text,
	`source` text DEFAULT 'manual' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_weight_occurred` ON `weight_logs` (`occurred_at`);