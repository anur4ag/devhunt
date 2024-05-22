CREATE TABLE IF NOT EXISTS "hackathons" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"tagline" varchar(255) NOT NULL,
	"desc" text NOT NULL,
	"cover_img" varchar(255) NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"is_online" boolean NOT NULL,
	"team_min" integer NOT NULL,
	"team_max" integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "hackathons" ("uuid");