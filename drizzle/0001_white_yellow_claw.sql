ALTER TABLE "users" RENAME COLUMN "given_name" TO "name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "family_name";