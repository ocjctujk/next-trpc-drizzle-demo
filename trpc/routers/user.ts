import { db } from "@/src";
import { publicProcedure, router } from "../trpc";
import { users } from "@/src/db/schema";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";

export const userRouter = router({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        age: z.number().int().min(0),
        email: z.email(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const [user] = await db
        .insert(users)
        .values({
          name: input.name,
          age: input.age,
          email: input.email,
          password: hashedPassword,
        })
        .returning();
      return { id: user.id, name: user.name, email: user.email, age: user.age };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.email(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      const userRows = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email));

      const user = userRows[0];

      if (!user) throw new Error("User not found, email is incorrect. You can sign up to create an account");

      const valid = await bcrypt.compare(input.password, user.password);
      if (!valid) throw new Error("Invalid credentials");

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // ── The important fix ──
      (await cookies()).set({
        name: "token",
        value: token,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
        // secure: process.env.NODE_ENV === "production",   // ← recommended
        // sameSite: "strict",                              // ← usually good choice
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
      };
    }),

  logout: publicProcedure.mutation(async () => {
    // ── The important fix ──
    (await cookies()).set({
      name: "token",
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });

    return { success: true };
  }),
});
