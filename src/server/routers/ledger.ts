import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const ledgerRouter = router({
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user!.id!;
    const aggregation = await ctx.prisma.creditLedgerEntry.aggregate({
      where: { userId },
      _sum: { amount: true },
    });
    return { balance: aggregation._sum.amount ?? 0 };
  }),

  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user!.id!;
    return ctx.prisma.creditLedgerEntry.findMany({
      where: { userId },
      include: {
        booking: {
          include: {
            teachSkill: { select: { skillName: true } },
            learner: { select: { name: true } },
            teacher: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  getBalanceForUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const aggregation = await ctx.prisma.creditLedgerEntry.aggregate({
        where: { userId: input.userId },
        _sum: { amount: true },
      });
      return { balance: aggregation._sum.amount ?? 0 };
    }),
});
