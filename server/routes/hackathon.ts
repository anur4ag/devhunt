import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { hackathons as hackathonTable } from "../db/schema/hackathons";
import { db } from "../db";
import { and, eq, isNull, ne } from "drizzle-orm";
import { getUser } from "../kinde";
import { user_hackathons as user_hackathon_table } from "../db/schema/user_hackathon";
import { teams, teams as teamsTable } from "../db/schema/teams";
import { users as usersTable } from "../db/schema/users";
import { hackathon_tags as hackathonTagsTable } from "../db/schema/hackathonTags";

const HackathonSchema = z.object({
  uuid: z.string().uuid(),
  name: z.string(),
  tagline: z.string(),
  desc: z.string(),
  cover_img: z.string().url(),
  is_online: z.boolean(),
  team_min: z.number(),
  team_max: z.number(),
});

const uuidSchema = HackathonSchema.pick({ uuid: true });
const HackathonPostSchema = HackathonSchema.omit({ uuid: true });

export const hackathonRoute = new Hono()
  .get("/", async (c) => {
    const hackathons = await db.select().from(hackathonTable);
    const tags = await db.select().from(hackathonTagsTable);
    return c.json({ hackathons, tags }, 200);
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
  )
  .post(
    "/register",
    getUser,
    zValidator(
      "json",
      z.object({ hackathon_id: z.string().uuid() }),
      (result, c) => {
        if (!result.success) {
          return c.json({ message: "Invalid hackathon id" }, 400);
        }
      }
    ),
    async (c) => {
      const user = c.var.user;
      const hackathon_id = c.req.valid("json").hackathon_id;
      const user_hackathon = await db.insert(user_hackathon_table).values({
        user_id: user.id,
        hackathon_id,
      });
      return c.json({ message: "Registered for hackathon" }, 201);
    }
  )
  .post(
    "/newteam",
    getUser,
    zValidator(
      "json",
      z.object({
        team_name: z.string().max(256),
        hackathon_id: z.string().uuid(),
      }),
      (result, c) => {
        if (!result.success) {
          return c.json({ message: "Invalid team name" }, 400);
        }
      }
    ),
    async (c) => {
      const user = c.var.user;
      const { team_name, hackathon_id } = c.req.valid("json");
      const uuid = crypto.randomUUID();
      const newTeam = await db
        .insert(teamsTable)
        .values({
          name: team_name,
          hackathon_id,
          created_by: user.id,
          id: uuid,
        })
        .returning();
      const team_id = newTeam[0].id;
      const existingTeam = await db
        .select()
        .from(user_hackathon_table)
        .where(
          and(
            eq(user_hackathon_table.user_id, user.id),
            eq(user_hackathon_table.hackathon_id, hackathon_id)
          )
        );
      if (existingTeam.length === 0) {
        console.log("not registered -------> regestering");
        await db.insert(user_hackathon_table).values({
          user_id: user.id,
          hackathon_id,
          team_id,
        });
        return c.json(
          { message: "Team created and Registered for hackathon", newTeam },
          201
        );
      } else {
        const updateUserHackathon = await db
          .update(user_hackathon_table)
          .set({ team_id })
          .where(
            and(
              eq(user_hackathon_table.user_id, user.id),
              eq(user_hackathon_table.hackathon_id, hackathon_id)
            )
          );
        return c.json({ message: "Team updated", newTeam }, 201);
      }
    }
  )
  .post(
    "/teammates",
    getUser,
    zValidator(
      "json",
      z.object({
        hackathon_id: z.string().uuid(),
      }),
      (result, c) => {
        console.log(result);
        if (!result.success) {
          return c.json({ message: "Invalid hackathon id" }, 400);
        }
      }
    ),
    async (c) => {
      const user = c.var.user;
      const hackathon_id = c.req.valid("json").hackathon_id;
      const potential_teammates = await db
        .select({
          id: usersTable.id,
          given_name: usersTable.name,
          email: usersTable.email,
          picture: usersTable.picture,
        })
        .from(user_hackathon_table)
        .innerJoin(usersTable, eq(user_hackathon_table.user_id, usersTable.id))
        .where(
          and(
            eq(user_hackathon_table.hackathon_id, hackathon_id),
            isNull(user_hackathon_table.team_id),
            ne(user_hackathon_table.user_id, user.id)
          )
        );
      return c.json({ potential_teammates });
    }
  )
  .post(
    "/team",
    getUser,
    zValidator(
      "json",
      z.object({
        hackathon_id: z.string().uuid(),
      }),
      (result, c) => {
        console.log(result);
        if (!result.success) {
          return c.json({ message: "Invalid hackathon id" }, 400);
        }
      }
    ),
    async (c) => {
      const user = c.var.user;
      const hackathon_id = c.req.valid("json").hackathon_id;
      const potential_team = await db
        .select({
          id: teamsTable.id,
          team_name: teamsTable.name,
        })
        .from(user_hackathon_table)
        .innerJoin(teamsTable, eq(user_hackathon_table.team_id, teamsTable.id))
        .where(
          and(
            eq(user_hackathon_table.hackathon_id, hackathon_id),
            isNull(user_hackathon_table.team_id),
            ne(user_hackathon_table.user_id, user.id)
          )
        );
      return c.json({ potential_team });
    }
  );
