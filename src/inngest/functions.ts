import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "20s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const loopExample = inngest.createFunction(
  { id: "loop-function" },
  { event: "test/loop.function" },
  async ({ step }) => {
    await step.run("hello", () => {
      console.log("hello");
    });
    await step.sleep("please-wait", "5s");
    await step.run("a", async () => {
      console.log("a");


    });
    await step.sleep("please-wait", "4s");
    await step.run("b", async () => {
      console.log("b");
    });
    await step.sleep("please-wait", "3s");
    await step.run("c", async () => {
      console.log("c");
    });
  },
);
