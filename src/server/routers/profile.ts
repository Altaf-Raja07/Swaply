import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const profileRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user!.id!;
    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
      include: {
        teachSkills: { orderBy: { createdAt: "desc" } },
        learnGoals: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }
    return user;
  }),

  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        include: {
          teachSkills: { orderBy: { createdAt: "desc" } },
        },
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      const { password, ...safe } = user;
      return safe;
    }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        image: z.string().optional(),
        bio: z.string().optional(),
        timezone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id!;
      await ctx.prisma.user.update({
        where: { id: userId },
        data: input,
      });
      return { success: true };
    }),
});
