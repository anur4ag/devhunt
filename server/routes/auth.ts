import { Hono } from "hono";
import { kindeClient, sessionManager } from "../kinde";
import { getUser } from "../kinde";
import { db } from "../db";
import { users as usersTable } from "../db/schema/users";
import { eq } from "drizzle-orm";

export const authRoute = new Hono()
  .get("/login", async (c) => {
    const loginUrl = await kindeClient.login(sessionManager(c));
    return c.redirect(loginUrl.toString());
  })
  .get("/register", async (c) => {
    const registerUrl = await kindeClient.register(sessionManager(c));
    return c.redirect(registerUrl.toString());
  })
  .get("/callback", async (c) => {
    // get called eveyr time we login or register
    const url = new URL(c.req.url);
    await kindeClient.handleRedirectToApp(sessionManager(c), url);
    return c.redirect("/api/success");
  })
  .get("/logout", async (c) => {
    const logoutUrl = await kindeClient.logout(sessionManager(c));
    return c.redirect(logoutUrl.toString());
  })
  .get("/success", getUser, async (c) => {
    const user = c.var.user;
    if (!user || !user.id) {
      return c.json({ error: "Authentication failed" }, 401);
    }
    const userRecord = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, user.id));

    if (userRecord.length === 0) {
      const insertedUser = await db.insert(usersTable).values({
        id: user.id,
        name: user.given_name,
        email: user.email,
        picture: user.picture,
      });
      console.log("inserted user: ", insertedUser);
      return c.redirect("/");
    }
    console.log("User already exists in db");
    return c.redirect("/");
    // return c.json({ user });
  })
  .get("/me", getUser, async (c) => {
    const user = c.var.user;
    return c.json({ user });
  });
