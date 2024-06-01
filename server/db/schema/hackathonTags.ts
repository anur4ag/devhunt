import {
  pgTable,
  uuid,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { hackathons as hackatonsTable } from "./hackathons";

export const hackathon_tags = pgTable(
  "hackathon_tags",
  {
    uuid: uuid("uuid").primaryKey(),
    content: varchar("content", { length: 255 }).notNull(),
    hackathon_id: uuid("hackathon_id")
      .notNull()
      .references(() => hackatonsTable.uuid, { onDelete: "cascade" }),
  },
  (hackathon_tags) => {
    return {
      hackathonIdIndex: index("hackathonTags_idx").on(
        hackathon_tags.hackathon_id
      ),
    };
  }
);
