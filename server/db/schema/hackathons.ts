import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const hackathons = pgTable(
  "hackathons",
  {
    uuid: uuid("uuid").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    tagline: varchar("tagline", { length: 255 }).notNull(),
    desc: text("desc").notNull(),
    cover_img: varchar("cover_img", { length: 255 }).notNull(),
    starts_at: timestamp("starts_at").defaultNow(),
    ends_at: timestamp("ends_at").defaultNow(),
    is_online: boolean("is_online").notNull(),
    team_min: integer("team_min").notNull(),
    team_max: integer("team_max").notNull(),
  },
  (hackathons) => {
    return {
      hackathonIdIndex: index("hackathon_idx").on(hackathons.uuid),
    };
  }
);
