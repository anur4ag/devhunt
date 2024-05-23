ALTER TABLE "users" RENAME COLUMN "uuid" TO "user_id";--> statement-breakpoint
ALTER TABLE "teams" DROP CONSTRAINT "teams_created_by_users_uuid_fk";
--> statement-breakpoint
ALTER TABLE "user_hackathons" DROP CONSTRAINT "user_hackathons_uuid_users_uuid_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "user_idx";--> statement-breakpoint
ALTER TABLE "teams" ALTER COLUMN "created_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_hackathons" ALTER COLUMN "uuid" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_created_by_users_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_hackathons" ADD CONSTRAINT "user_hackathons_uuid_users_user_id_fk" FOREIGN KEY ("uuid") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_idx" ON "users" ("user_id");