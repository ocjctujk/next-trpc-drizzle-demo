import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "./routers/_app.ts";

export const trpc = createTRPCReact<AppRouter>();
