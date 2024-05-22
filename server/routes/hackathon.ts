import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { hackathons as hackathonTable } from "../db/schema/hackathons";
import { db } from "../db";
import { eq } from "drizzle-orm";

const HackathonSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string(),
  tagline: z.string(),
  desc: z.string(),
  cover_img: z.string().url(),
  starts_at: z.date().optional(),
  ends_at: z.date().optional(),
  is_online: z.boolean(),
  team_min: z.number(),
  team_max: z.number(),
});

const uuidSchema = HackathonSchema.pick({ uuid: true });
const HackathonPostSchema = HackathonSchema.omit({ uuid: true });

export const hackathonRoute = new Hono()
  .get("/", async (c) => {
    const hackathons = await db.select().from(hackathonTable);
    return c.json({ hackathons }, 200);
  })
  .get(
    "/:uuid",
    zValidator("param", uuidSchema, (result, c) => {
      if (!result.success) {
        return c.json({ message: "Invalid request param" }, 400);
      }
    }),
    async (c) => {
      const uuid = c.req.valid("param").uuid;
      const hackathon = await db
        .select()
        .from(hackathonTable)
        .where(eq(hackathonTable.uuid, uuid));
      console.log(hackathon);
      if (hackathon.length === 0) {
        return c.json({ message: "Hackathon not found" }, 404);
      }
      return c.json({ hackathon });
    }
  )
  .post(
    "/",
    zValidator("json", HackathonPostSchema, (result, c) => {
      if (!result.success) {
        console.log(result);
        return c.json({ message: "Invalid request body" }, 400);
      }
    }),
    async (c) => {
      let hackathon = c.req.valid("json");
      const uniqueid: string = crypto.randomUUID();
      const postedHackathon = await db
        .insert(hackathonTable)
        .values({
          ...hackathon,
          uuid: uniqueid,
        })
        .returning();

      return c.json({ message: "Hackathon created", postedHackathon }, 201);
    }
  );
