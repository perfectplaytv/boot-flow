CREATE TABLE `cobrancas` (
	`id` text PRIMARY KEY NOT NULL,
	`cliente_id` text,
	`valor` real NOT NULL,
	`data_vencimento` text NOT NULL,
	`status` text DEFAULT 'pendente' NOT NULL,
	`descricao` text,
	`owner_uid` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `resellers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text,
	`permission` text DEFAULT 'reseller',
	`credits` integer DEFAULT 10,
	`personal_name` text,
	`status` text DEFAULT 'Ativo',
	`force_password_change` integer DEFAULT false,
	`servers` text,
	`master_reseller` text,
	`disable_login_days` integer DEFAULT 0,
	`monthly_reseller` integer DEFAULT false,
	`telegram` text,
	`whatsapp` text,
	`observations` text,
	`owner_uid` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `resellers_username_unique` ON `resellers` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `resellers_email_unique` ON `resellers` (`email`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`server` text,
	`plan` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`status` text DEFAULT 'Ativo' NOT NULL,
	`expiration_date` text NOT NULL,
	`devices` integer DEFAULT 0,
	`credits` integer DEFAULT 0,
	`password` text,
	`bouquets` text,
	`real_name` text,
	`whatsapp` text,
	`telegram` text,
	`observations` text,
	`notes` text,
	`m3u_url` text,
	`renewal_date` text,
	`phone` text,
	`owner_uid` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);