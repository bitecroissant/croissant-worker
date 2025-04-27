ALTER TABLE `event_dates` ADD `is_active` integer;--> statement-breakpoint
ALTER TABLE `event_dates` DROP COLUMN `active_status`;--> statement-breakpoint
ALTER TABLE `holidays` ADD `is_active` integer;--> statement-breakpoint
ALTER TABLE `holidays` DROP COLUMN `active_status`;--> statement-breakpoint
ALTER TABLE `poetry_lines` ADD `is_active` integer;--> statement-breakpoint
ALTER TABLE `poetry_lines` DROP COLUMN `active_status`;--> statement-breakpoint
ALTER TABLE `users_pin` ADD `is_active` integer;--> statement-breakpoint
ALTER TABLE `users_pin` DROP COLUMN `active_status`;