import { z } from "zod";
import { db } from "@/src";
import { tags } from "@/src/db/schema";
import { publicProcedure, router } from "../trpc";

export const tagsRouter = router({
  list: publicProcedure.query(async () => {
    return await db.select().from(tags);
  }),

  create: publicProcedure
    .input(z.object({ name: z.string(), userId: z.number().optional() }))
    .mutation(async ({ input }) => {
      const [tag] = await db
        .insert(tags)
        .values({ name: input.name, userId: input.userId ?? null })
        .returning();
      return tag;
    }),
});
