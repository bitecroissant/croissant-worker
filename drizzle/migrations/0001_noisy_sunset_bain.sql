CREATE TABLE `eventDates` (
	`id` text PRIMARY KEY NOT NULL,
	`gmt_create` text,
	`gmt_modified` text,
	`delete_flag` integer,
	`active_status` text,
	`type` text,
	`events_id` text,
	`happen_at` text,
	`creator` text
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`gmt_create` text,
	`gmt_modified` text,
	`delete_flag` integer,
	`active_status` text,
	`name` text,
	`isLoop` integer,
	`isPin` integer,
	`creator` text,
	`emoji` text,
	`iconName` text,
	`iconColor` text
);
--> statement-breakpoint
CREATE TABLE `holidays` (
	`id` text PRIMARY KEY NOT NULL,
	`gmt_create` text,
	`gmt_modified` text,
	`delete_flag` integer,
	`active_status` text,
	`name` text,
	`creator` text
);
--> statement-breakpoint
CREATE TABLE `poetryLines` (
	`id` text PRIMARY KEY NOT NULL,
	`gmt_create` text,
	`gmt_modified` text,
	`delete_flag` integer,
	`active_status` text,
	`line` text,
	`author` text,
	`dynasty` text,
	`title` text,
	`showDate` text,
	`creator` text
);
--> statement-breakpoint
CREATE TABLE `solarTerms` (
	`id` text PRIMARY KEY NOT NULL,
	`gmt_create` text,
	`gmt_modified` text,
	`delete_flag` integer,
	`index` integer,
	`emoji` text,
	`name` text,
	`enName` text,
	`meaning` text,
	`meteorologicalChanges` text,
	`relatedVerses` text,
	`custom` text,
	`recommendedFoods` text,
	`addition` text,
	`creator` text
);
--> statement-breakpoint
ALTER TABLE `users_pin` ADD `creator` text;