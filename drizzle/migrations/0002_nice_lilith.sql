ALTER TABLE `eventDates` RENAME TO `event_dates`;--> statement-breakpoint
ALTER TABLE `poetryLines` RENAME TO `poetry_lines`;--> statement-breakpoint
ALTER TABLE `solarTerms` RENAME TO `solar_terms`;--> statement-breakpoint
ALTER TABLE `poetry_lines` RENAME COLUMN "showDate" TO "show_date";--> statement-breakpoint
ALTER TABLE `solar_terms` RENAME COLUMN "enName" TO "en_name";--> statement-breakpoint
ALTER TABLE `solar_terms` RENAME COLUMN "meteorologicalChanges" TO "meteorological_changes";--> statement-breakpoint
ALTER TABLE `solar_terms` RENAME COLUMN "relatedVerses" TO "related_verses";--> statement-breakpoint
ALTER TABLE `solar_terms` RENAME COLUMN "recommendedFoods" TO "recommended_foods";--> statement-breakpoint
ALTER TABLE `events` RENAME COLUMN "isLoop" TO "is_loop";--> statement-breakpoint
ALTER TABLE `events` RENAME COLUMN "isPin" TO "is_pin";--> statement-breakpoint
ALTER TABLE `events` RENAME COLUMN "iconName" TO "icon_name";--> statement-breakpoint
ALTER TABLE `events` ADD `icon_color` text;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `iconColor`;