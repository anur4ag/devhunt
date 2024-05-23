import { Hono } from "hono";
import { logger } from "hono/logger";
import { authRoute } from "./routes/auth";
import { hackathonRoute } from "./routes/hackathon";
import { userHackathonRoute } from "./routes/userHackathon";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app
  .basePath("/api")
  .route("/hackathons", hackathonRoute)
  .route("/", authRoute)
  .route("/user", userHackathonRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
