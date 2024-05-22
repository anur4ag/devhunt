CREATE TABLE IF NOT EXISTS "teams" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"tagline" varchar(255) NOT NULL,
	"hackathon_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"bio" text NOT NULL
);
--> statement-breakpoint
DROP INDEX IF EXISTS "name_idx";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_hackathon_id_hackathons_uuid_fk" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathons"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_created_by_users_uuid_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_idx" ON "teams" ("uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_idx" ON "users" ("uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hackathon_idx" ON "hackathons" ("uuid");