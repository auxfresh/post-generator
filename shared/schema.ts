import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  createdAt: text("created_at").notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  platform: text("platform").notNull(),
  tone: text("tone").notNull(),
  idea: text("idea"),
  hasEmojis: boolean("has_emojis").default(false).notNull(),
  hasHashtags: boolean("has_hashtags").default(false).notNull(),
  hasSuggestedImages: boolean("has_suggested_images").default(false).notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
}).required({ userId: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;
