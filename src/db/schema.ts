import { relations } from "drizzle-orm";
import {
  serial,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  age: integer("age").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const noteGroups = pgTable("note_groups", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  groupId: integer("group_id").references(() => noteGroups.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const notesToTags = pgTable(
  "notes_to_tags",
  {
    noteId: integer("note_id")
      .notNull()
      .references(() => notes.id),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.noteId, t.tagId] }), // 👈 prevents duplicates
  }),
);

// -----------------------------
// Relations
// -----------------------------

export const userRelations = relations(users, ({ many }) => ({
  tags: many(tags),
  noteGroups: many(noteGroups),
}));

export const noteGroupsRelations = relations(noteGroups, ({ one, many }) => ({
  user: one(users, {
    fields: [noteGroups.userId],
    references: [users.id],
  }),
  notes: many(notes),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  noteGroup: one(noteGroups, {
    fields: [notes.groupId],
    references: [noteGroups.id],
  }),
  notesToTags: many(notesToTags),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, {
    fields: [tags.userId],
    references: [users.id],
  }),
  notesToTags: many(notesToTags),
}));

export const notesToTagsRelations = relations(notesToTags, ({ one }) => ({
  note: one(notes, {
    fields: [notesToTags.noteId],
    references: [notes.id],
  }),
  tag: one(tags, {
    fields: [notesToTags.tagId],
    references: [tags.id],
  }),
}));
