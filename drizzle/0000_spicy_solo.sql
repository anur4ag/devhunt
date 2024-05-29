CREATE TABLE IF NOT EXISTS "hackathons" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"tagline" varchar(255) NOT NULL,
	"desc" text NOT NULL,
	"cover_img" varchar(255) NOT NULL,
	"starts_at" timestamp DEFAULT now(),
	"ends_at" timestamp DEFAULT now(),
	"is_online" boolean NOT NULL,
	"team_min" integer NOT NULL,
	"team_max" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"hackathon_id" uuid NOT NULL,
	"created_by" text NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_hackathons" (
	"uuid" text NOT NULL,
	"hackathon_id" uuid NOT NULL,
	"team_id" uuid,
	"registered_at" timestamp DEFAULT now(),
	"participation_status" text DEFAULT 'registered',
	CONSTRAINT "user_hackathons_uuid_hackathon_id_pk" PRIMARY KEY("uuid","hackathon_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" text PRIMARY KEY NOT NULL,
	"given_name" text NOT NULL,
	"family_name" text,
	"email" text NOT NULL,
	"picture" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_hackathon_id_hackathons_uuid_fk" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathons"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
DO $$ BEGIN
 ALTER TABLE "user_hackathons" ADD CONSTRAINT "user_hackathons_hackathon_id_hackathons_uuid_fk" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathons"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_hackathons" ADD CONSTRAINT "user_hackathons_team_id_teams_uuid_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("uuid") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hackathon_idx" ON "hackathons" ("uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_idx" ON "teams" ("uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_idx" ON "users" ("user_id");