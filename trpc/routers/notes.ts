import { z } from "zod";
import { db } from "@/src";
import { notes } from "@/src/db/schema";
import { publicProcedure, router } from "../trpc";
import { eq } from "drizzle-orm";

export const notesRouter = router({
  // Fetch all notes
  list: publicProcedure.query(async () => {
    return await db.select().from(notes);
  }),

  // Fetch notes by group id
  byGroup: publicProcedure
    .input(z.object({ groupId: z.number() }))
    .query(async ({ input }) => {
      return await db
        .select()
        .from(notes)
        .where(eq(notes.groupId, input.groupId));
    }),

  // Fetch single note
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const [note] = await db
        .select()
        .from(notes)
        .where(eq(notes.id, input.id));
      return note ?? null;
    }),

  // Create new note
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string().optional(),
        groupId: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const [note] = await db
        .insert(notes)
        .values({
          title: input.title,
          content: input.content ?? "",
          groupId: input.groupId ?? null,
        })
        .returning();
      return note;
    }),

  // ✅ Update existing note
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        groupId: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...updateFields } = input;

      // Prevent empty update
      if (Object.keys(updateFields).length === 0) {
        throw new Error("No fields provided to update.");
      }

      const [updatedNote] = await db
        .update(notes)
        .set({
          ...updateFields,
          updatedAt: new Date(),
        })
        .where(eq(notes.id, id))
        .returning();

      return updatedNote;
    }),
});
