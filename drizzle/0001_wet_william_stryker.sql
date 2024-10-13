DROP TABLE "account";--> statement-breakpoint
DROP TABLE "authenticator";--> statement-breakpoint
DROP TABLE "session";--> statement-breakpoint
DROP TABLE "verificationToken";--> statement-breakpoint
ALTER TABLE "changelog" ADD COLUMN "repositoryName" text NOT NULL;