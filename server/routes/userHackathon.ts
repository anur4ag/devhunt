import { Hono } from "hono";
import { getUser } from "../kinde";
import { db } from "../db";
import { users as usersTable } from "../db/schema/users";
import { and, eq, inArray, ne } from "drizzle-orm";
import { user_hackathons as userHackathonTable } from "../db/schema/user_hackathon";
import { hackathons as hackathonsTable } from "../db/schema/hackathons";
import { teams as teamsTable } from "../db/schema/teams";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { uuid } from "drizzle-orm/pg-core";

export const userHackathonRoute = new Hono()
  .get("/profile", getUser, async (c) => {
    const user = c.var.user;
    const userDetails = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, user.id));
    if (userDetails.length === 0) {
      return c.json({
        error: "User not found",
      });
    }
    return c.json(userDetails?.[0]);
  })
  .get("/userhackathons", getUser, async (c) => {
    const user = c.var.user;
    const user_registered_hackathons = await db
      .select()
      .from(userHackathonTable)
      .where(eq(userHackathonTable.user_id, user.id));
    const hackathonIds = user_registered_hackathons.map(
      (hackathon) => hackathon.hackathon_id
    );
    return c.json(hackathonIds);
  })
  .put(
    "/addtoteam",
    getUser,
    zValidator(
      "json",
      z.object({ hackathonId: z.string().uuid(), userId: z.string() }),
      (result, c) => {
        if (!result.success) {
          console.log(result);
          return c.json({ message: "Invalid request body" }, 400);
        }
      }
    ),
    async (c) => {
      const user = c.var.user;
      const { hackathonId, userId } = c.req.valid("json");
      console.log(hackathonId, userId);
      const userHackathon = await db
        .select()
        .from(userHackathonTable)
        .where(
          and(
            eq(userHackathonTable.user_id, user.id),
            eq(userHackathonTable.hackathon_id, hackathonId)
          )
        );
      if (userHackathon.length > 0) {
        await db
          .update(userHackathonTable)
          .set({ team_id: userHackathon[0].team_id })
          .where(eq(userHackathonTable.user_id, userId));
        return c.json({
          message: "Added to team successfully",
        });
      } else {
        return c.json({ message: "User not registered for this hackathon" });
      }
    }
  )
  .get(
    "/myteam/:hackathonId",
    zValidator(
      "param",
      z.object({ hackathonId: z.string().uuid() }),
      (result, c) => {
        if (!result.success) {
          return c.json({ message: "Invalid request param" }, 400);
        }
      }
    ),
    getUser,
    async (c) => {
      const user = c.var.user;
      const { hackathonId } = c.req.valid("param");
      const userHackathon = await db
        .select()
        .from(userHackathonTable)
        .where(
          and(
            eq(userHackathonTable.user_id, user.id),
            eq(userHackathonTable.hackathon_id, hackathonId)
          )
        );
      if (userHackathon.length === 0) {
        return c.json({
          message: "User not registered for this hackathon",
          case: 1,
        });
      }
      const teamId = userHackathon[0].team_id;
      if (teamId === null) {
        return c.json({ message: "User not in any team", case: 2 });
      }
      const teamMembers = await db
        .select()
        .from(userHackathonTable)
        .where(
          and(
            eq(userHackathonTable.team_id, teamId),
            ne(userHackathonTable.user_id, user.id)
          )
        );
      const teamMembersId = teamMembers.map((member) => member.user_id);

      const teamDetails = await db
        .select({ teamName: teamsTable.name, createdBy: teamsTable.created_by })
        .from(teamsTable)
        .where(eq(teamsTable.id, teamId));

      const teamMembersDetails = await db
        .select()
        .from(usersTable)
        .where(inArray(usersTable.id, teamMembersId));
      return c.json({
        createdBy: { name: teamDetails[0].createdBy },
        teamName: teamDetails[0].teamName,
        teamMembers: teamMembersDetails,
        case: 3,
      });
    }
  );
