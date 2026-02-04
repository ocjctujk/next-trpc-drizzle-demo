import { appRouter } from "@/trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

export const runtime = "nodejs";

export async function GET(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
    onError: ({ error, path, input }) => {
      console.error("tRPC GET Error:", {
        path,
        message: error.message,
        code: error.code,
        input,
      });
    },
  });
}

export async function POST(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
    onError: ({ error, path, input }) => {
      console.error("tRPC POST Error:", {
        path,
        message: error.message,
        code: error.code,
        input,
      });
    },
  });
}
