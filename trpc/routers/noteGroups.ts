import { z } from "zod";
import { db } from "@/src";
import { noteGroups } from "@/src/db/schema";
import { publicProcedure, router } from "../trpc";
import { eq } from "drizzle-orm";

export const noteGroupsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.select().from(noteGroups);
  }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const [group] = await db
        .select()
        .from(noteGroups)
        .where(eq(noteGroups.id, input.id));
      return group ?? null;
    }),

  create: publicProcedure
    .input(z.object({ title: z.string(), userId: z.number().optional() }))
    .mutation(async ({ input }) => {
      const [group] = await db
        .insert(noteGroups)
        .values({
          title: input.title,
          userId: input.userId ?? null,
        })
        .returning();
      return group;
    }),
});
