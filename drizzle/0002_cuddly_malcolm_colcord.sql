CREATE TABLE IF NOT EXISTS "user_hackathons" (
	"uuid" uuid NOT NULL,
	"hackathon_id" uuid NOT NULL,
	"team_id" uuid,
	"registered_at" timestamp DEFAULT now(),
	CONSTRAINT "user_hackathons_uuid_hackathon_id_pk" PRIMARY KEY("uuid","hackathon_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_hackathons" ADD CONSTRAINT "user_hackathons_uuid_users_uuid_fk" FOREIGN KEY ("uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;
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
