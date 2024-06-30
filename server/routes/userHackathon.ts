import { Hono } from "hono";
import { getUser } from "../kinde";
import { db } from "../db";
import { users as usersTable } from "../db/schema/users";
import { and, eq, inArray, ne, sql, not, exists } from "drizzle-orm";
import { user_hackathons as userHackathonTable } from "../db/schema/user_hackathon";
import { hackathons as hackathonTable } from "../db/schema/hackathons";
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
        return c.json(
          {
            message: "User not registered for this hackathon",
            case: 1,
          },
          200
        );
      }
      const teamId = userHackathon[0].team_id;
      if (teamId === null) {
        return c.json({ message: "User not in any team", case: 2 }, 200);
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

      if (teamMembersId.length > 0) {
        const teamMembersDetails = await db
          .select()
          .from(usersTable)
          .where(inArray(usersTable.id, teamMembersId));
        // Proceed with using teamMembersDetails as before
        return c.json(
          {
            createdBy: { name: teamDetails[0].createdBy },
            teamName: teamDetails[0].teamName,
            teamMembers: teamMembersDetails,
            case: 3,
          },
          200
        );
      } else {
        return c.json(
          {
            createdBy: { name: teamDetails[0].createdBy },
            teamName: teamDetails[0].teamName,
            teamMembers: [],
            case: 3,
          },
          200
        );
      }
    }
  )
  .get("/availaible-team", async (c) => {
    // const user = c.var.user;
    const result = await db
      .select({
        teamId: teamsTable.id,
        teamName: teamsTable.name,
        teamCreator: usersTable.name,
        teamCreatedAt: teamsTable.created_at,
      })
      .from(teamsTable)
      .innerJoin(
        hackathonTable,
        eq(teamsTable.hackathon_id, hackathonTable.uuid)
      )
      .leftJoin(
        userHackathonTable,
        eq(teamsTable.id, userHackathonTable.team_id)
      )
      .innerJoin(usersTable, eq(teamsTable.created_by, usersTable.id))
      .where(
        and(
          eq(
            hackathonTable.uuid,
            db
              .select({ uuid: hackathonTable.uuid })
              .from(hackathonTable)
              .where(
                eq(hackathonTable.uuid, "202a8d4f-7ea5-4836-8d6a-e494a988746f")
              )
              .limit(1)
          ),
          not(
            exists(
              db
                .select()
                .from(userHackathonTable)
                .where(
                  and(
                    eq(
                      userHackathonTable.user_id,
                      "kp_d3d23041f3544aef9f51a4f6378302c6"
                    ),
                    eq(userHackathonTable.hackathon_id, hackathonTable.uuid)
                    // sql`${userHackathonTable.team_id} IS NOT NULL`
                  )
                )
            )
          )
        )
      )
      .groupBy(
        teamsTable.id,
        teamsTable.name,
        hackathonTable.team_max,
        usersTable.id,
        teamsTable.created_at
      );

    return c.json({ result });
  });
