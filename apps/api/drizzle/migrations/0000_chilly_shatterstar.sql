CREATE TABLE `profile` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`birthdate` integer,
	`height_cm` real,
	`units` text DEFAULT 'metric' NOT NULL,
	`macro_targets` text,
	`water_settings` text DEFAULT '{"glassSizeMl":250,"dailyGoalMl":2000}' NOT NULL,
	`backup_settings` text DEFAULT '{"enabled":true,"intervalDays":7,"keepLastN":10}' NOT NULL,
	`theme` text DEFAULT 'auto' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
