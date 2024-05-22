import { pgTable, uuid, text, index } from "drizzle-orm/pg-core";
export const users = pgTable(
  "users",
  {
    id: uuid("uuid").primaryKey(),
    name: text("name").notNull(),
    username: text("username").notNull(),
    email: text("email").notNull(),
    bio: text("bio").notNull(),
  },
  (users) => {
    return {
      userIdIndex: index("user_idx").on(users.id),
    };
  }
);
