import { pgTable, text, serial, integer, boolean, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const emergency_contacts = pgTable("emergency_contacts", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  phone_number: text("phone_number").notNull(),
  relationship: text("relationship").notNull(),
  photo_url: text("photo_url"),
  is_primary: boolean("is_primary").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const sos_settings = pgTable("sos_settings", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  default_message: text("default_message").notNull().default("Emergency! I need help. This is my current location:"),
  auto_call_police: boolean("auto_call_police").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const location_history = pgTable("location_history", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  sos_triggered: boolean("sos_triggered").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertEmergencyContactSchema = createInsertSchema(emergency_contacts, {
  relationship: z.enum(['Family', 'Friend', 'Neighbor', 'Coworker', 'Other']),
});
export const selectEmergencyContactSchema = createSelectSchema(emergency_contacts);

export const insertSosSettingsSchema = createInsertSchema(sos_settings);
export const selectSosSettingsSchema = createSelectSchema(sos_settings);

export const insertLocationHistorySchema = createInsertSchema(location_history);
export const selectLocationHistorySchema = createSelectSchema(location_history);

// Type exports
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type EmergencyContact = typeof emergency_contacts.$inferSelect;
export type SosSettings = typeof sos_settings.$inferSelect;
export type LocationHistory = typeof location_history.$inferSelect;