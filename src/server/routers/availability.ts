import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const availabilityRouter = router({
  setSlots: protectedProcedure
    .input(
      z.object({
        slots: z.array(
          z.object({
            dayOfWeek: z.number().min(0).max(6),
            startTime: z.string(),
            endTime: z.string(),
            isRecurring: z.boolean().default(true),
            specificDate: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id!;
      await ctx.prisma.$transaction(async (tx) => {
        await tx.availabilitySlot.deleteMany({ where: { userId } });
        for (const slot of input.slots) {
          await tx.availabilitySlot.create({
            data: {
              userId,
              dayOfWeek: slot.dayOfWeek,
              startTime: slot.startTime,
              endTime: slot.endTime,
              isRecurring: slot.isRecurring,
              specificDate: slot.specificDate ? new Date(slot.specificDate) : null,
            },
          });
        }
      });
      return { success: true };
    }),

  getMyAvailability: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user!.id!;
    return ctx.prisma.availabilitySlot.findMany({ where: { userId } });
  }),

  getForTeacher: publicProcedure
    .input(z.object({ teacherId: z.string() }))
    .query(async ({ ctx, input }) => {
      const slots = await ctx.prisma.availabilitySlot.findMany({
        where: { userId: input.teacherId },
      });
      const activeBookings = await ctx.prisma.booking.findMany({
        where: {
          teacherId: input.teacherId,
          status: { in: ["REQUESTED", "CONFIRMED", "COMPLETED"] },
        },
        select: { slotStart: true, slotEnd: true },
      });
      return { slots, activeBookings };
    }),
});
