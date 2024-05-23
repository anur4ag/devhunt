import {
  pgTable,
  uuid,
  timestamp,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { hackathons } from "./hackathons";
import { teams } from "./teams";

export const user_hackathons = pgTable(
  "user_hackathons",
  {
    user_id: text("uuid")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    hackathon_id: uuid("hackathon_id")
      .notNull()
      .references(() => hackathons.uuid, { onDelete: "cascade" }),
    team_id: uuid("team_id").references(() => teams.id, {
      onDelete: "set null",
    }),
    registered_at: timestamp("registered_at").defaultNow(),
    participationStatus: text("participation_status").default("registered"),
  },
  (user_hackathons) => {
    return {
      pk: primaryKey({
        columns: [user_hackathons.user_id, user_hackathons.hackathon_id],
      }),
      // hackathonIdIndex: index("hackathon_idx").on(user_hackathons.uuid),
    };
  }
);
