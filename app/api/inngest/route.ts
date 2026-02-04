import { inngest } from "@/src/inngest/client";
import { helloWorld, loopExample } from "@/src/inngest/functions";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    loopExample
  ],
});
