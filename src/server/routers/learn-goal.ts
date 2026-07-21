import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";

export const learnGoalRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user!.id!;
    return ctx.prisma.learnGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }),

  add: protectedProcedure
    .input(
      z.object({
        skillName: z.string().min(2, "Skill name must be at least 2 characters"),
        goalText: z.string().min(1, "Goal text is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id!;
      return ctx.prisma.learnGoal.create({
        data: { ...input, userId },
      });
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        skillName: z.string().min(2).optional(),
        goalText: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id!;
      const { id, ...data } = input;
      const existing = await ctx.prisma.learnGoal.findUnique({ where: { id } });
      if (!existing || existing.userId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your goal" });
      }
      return ctx.prisma.learnGoal.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id!;
      const existing = await ctx.prisma.learnGoal.findUnique({ where: { id: input.id } });
      if (!existing || existing.userId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your goal" });
      }
      await ctx.prisma.learnGoal.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
