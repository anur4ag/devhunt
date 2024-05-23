import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { hackathons } from "./hackathons";
import { users } from "./users";
export const teams = pgTable(
  "teams",
  {
    id: uuid("uuid").primaryKey(),
    name: text("name").notNull(),
    hackathon_id: uuid("hackathon_id")
      .notNull()
      .references(() => hackathons.uuid, { onDelete: "cascade" }),
    created_by: text("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    created_at: timestamp("timestamp").defaultNow(),
  },
  (teams) => {
    return {
      teamIdIndex: index("team_idx").on(teams.id),
    };
  }
);
