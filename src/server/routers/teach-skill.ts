import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";

export const teachSkillRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user!.id!;
    return ctx.prisma.teachSkill.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }),

  add: protectedProcedure
    .input(
      z.object({
        skillName: z.string().min(2, "Skill name must be at least 2 characters"),
        description: z.string().min(10, "Description must be at least 10 characters"),
        proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).default("Beginner"),
        creditCost: z.number().int().min(1).default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id!;
      return ctx.prisma.teachSkill.create({
        data: { ...input, userId },
      });
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        skillName: z.string().min(2).optional(),
        description: z.string().min(10).optional(),
        proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).optional(),
        creditCost: z.number().int().min(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id!;
      const { id, ...data } = input;
      const existing = await ctx.prisma.teachSkill.findUnique({ where: { id } });
      if (!existing || existing.userId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your skill" });
      }
      return ctx.prisma.teachSkill.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id!;
      const existing = await ctx.prisma.teachSkill.findUnique({ where: { id: input.id } });
      if (!existing || existing.userId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your skill" });
      }
      await ctx.prisma.teachSkill.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
