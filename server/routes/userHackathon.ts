import { Hono } from "hono";
import { getUser } from "../kinde";
import { db } from "../db";
import { users as usersTable } from "../db/schema/users";
import { eq } from "drizzle-orm";
import { user_hackathons as userHackathonTable } from "../db/schema/user_hackathon";
import { hackathons as hackathonsTable } from "../db/schema/hackathons";

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
  });
// .put("/register/:hackathonId", getUser, async (c) => {

// })
