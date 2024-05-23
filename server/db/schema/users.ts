import { pgTable, uuid, text, index } from "drizzle-orm/pg-core";
export const users = pgTable(
  "users",
  {
    id: text("user_id").notNull().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
  },
  (users) => {
    return {
      userIdIndex: index("user_idx").on(users.id),
    };
  }
);
