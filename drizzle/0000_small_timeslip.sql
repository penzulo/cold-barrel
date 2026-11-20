CREATE TABLE `enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`location` text NOT NULL,
	`pin` text NOT NULL,
	`delivery_date` text NOT NULL,
	`litres` real NOT NULL,
	`flavours` text NOT NULL,
	`created_at` integer NOT NULL
);
