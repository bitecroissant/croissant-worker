CREATE TABLE `users_pin` (
	`id` text PRIMARY KEY NOT NULL,
	`gmt_create` text,
	`gmt_modified` text,
	`delete_flag` integer,
	`uid` text,
	`pin` text,
	`active_status` text
);
