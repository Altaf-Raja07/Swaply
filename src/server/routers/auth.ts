import { z } from "zod";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

export const authRouter = router({
  signUp: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await prisma.user.findUnique({ where: { email: input.email } });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with this email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);

      await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
        },
      });

      await signIn("credentials", {
        email: input.email,
        password: input.password,
        redirect: false,
      });

      return { success: true };
    }),

  signIn: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({ where: { email: input.email } });
      if (!user || !user.password) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const isValid = await bcrypt.compare(input.password, user.password);
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      await signIn("credentials", {
        email: input.email,
        password: input.password,
        redirect: false,
      });

      return { success: true };
    }),

  signOut: protectedProcedure.mutation(async () => {
    await signOut({ redirect: false });
    return { success: true };
  }),

  getSession: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
});
