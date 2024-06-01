CREATE TABLE IF NOT EXISTS "hackathon_tags" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"content" varchar(255) NOT NULL,
	"hackathon_id" uuid NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hackathon_tags" ADD CONSTRAINT "hackathon_tags_hackathon_id_hackathons_uuid_fk" FOREIGN KEY ("hackathon_id") REFERENCES "public"."hackathons"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hackathonTags_idx" ON "hackathon_tags" ("hackathon_id");