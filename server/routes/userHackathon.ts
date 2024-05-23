import { Hono } from "hono";
import { getUser } from "../kinde";
import { db } from "../db";
import { users as usersTable } from "../db/schema/users";
import { eq } from "drizzle-orm";

export const userHackathonRoute = new Hono().get(
  "/profile",
  getUser,
  async (c) => {
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
  }
);
