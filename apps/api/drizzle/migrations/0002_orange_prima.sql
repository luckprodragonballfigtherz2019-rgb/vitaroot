CREATE TABLE `exercise_instances` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`order` integer NOT NULL,
	`notes` text,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `idx_exinstances_workout` ON `exercise_instances` (`workout_id`);--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`primary_muscle` text NOT NULL,
	`secondary_muscles` text DEFAULT '[]' NOT NULL,
	`equipment` text,
	`notes` text,
	`is_custom` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_exercises_name_unique` ON `exercises` (`name`);--> statement-breakpoint
CREATE INDEX `idx_exercises_primary_muscle` ON `exercises` (`primary_muscle`);--> statement-breakpoint
CREATE TABLE `sets` (
	`id` text PRIMARY KEY NOT NULL,
	`exercise_instance_id` text NOT NULL,
	`order` integer NOT NULL,
	`type` text DEFAULT 'normal' NOT NULL,
	`weight_kg` real,
	`reps` integer,
	`duration_sec` integer,
	`completed` integer DEFAULT false NOT NULL,
	`rest_sec` integer,
	`notes` text,
	FOREIGN KEY (`exercise_instance_id`) REFERENCES `exercise_instances`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_sets_exinstance` ON `sets` (`exercise_instance_id`);--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`started_at` integer NOT NULL,
	`finished_at` integer,
	`duration_min` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`name` text,
	`notes` text,
	`total_volume_kg` real,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_workouts_started_at` ON `workouts` (`started_at`);--> statement-breakpoint
CREATE INDEX `idx_workouts_status` ON `workouts` (`status`);