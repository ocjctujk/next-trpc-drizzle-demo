import { router } from "../trpc";
import { noteGroupsRouter } from "./noteGroups";
import { notesRouter } from "./notes";
import { tagsRouter } from "./tags";
import { userRouter } from "./user";

export const appRouter = router({
  notes: notesRouter,
  userRouter,
  noteGroupsRouter,
  tagsRouter,
});

export type AppRouter = typeof appRouter;
