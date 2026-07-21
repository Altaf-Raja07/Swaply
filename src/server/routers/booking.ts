import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../trpc";

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  REQUESTED: ["CONFIRMED", "DECLINED"],
  CONFIRMED: ["CANCELLED", "COMPLETED"],
};

function assertAllowedTransition(current: string, target: string) {
  const allowed = ALLOWED_TRANSITIONS[current];
  if (!allowed || !allowed.includes(target)) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: `Cannot transition booking from ${current} to ${target}`,
    });
  }
}

export const bookingRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const booking = await ctx.prisma.booking.findUnique({
        where: { id: input.id },
        include: {
          teachSkill: true,
          learner: { select: { id: true, name: true, image: true } },
          teacher: { select: { id: true, name: true, image: true } },
        },
      });
      if (!booking) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
      }
      return booking;
    }),

  create: protectedProcedure
    .input(
      z.object({
        teachSkillId: z.string(),
        teacherId: z.string(),
        slotStart: z.string(),
        slotEnd: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const learnerId = ctx.session.user!.id!;

      const teachSkill = await ctx.prisma.teachSkill.findUnique({
        where: { id: input.teachSkillId },
      });
      if (!teachSkill || teachSkill.userId !== input.teacherId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid teach skill" });
      }
      if (teachSkill.userId === learnerId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot book your own skill" });
      }

      const slotStart = new Date(input.slotStart);
      const slotEnd = new Date(input.slotEnd);

      return ctx.prisma.$transaction(async (tx) => {
        const lockKey = `booking:${input.teacherId}:${slotStart.getTime()}:${slotEnd.getTime()}`;
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))`;

        const conflicting = await tx.booking.findFirst({
          where: {
            teacherId: input.teacherId,
            slotStart: { lt: slotEnd },
            slotEnd: { gt: slotStart },
            status: { in: ["REQUESTED", "CONFIRMED", "COMPLETED"] },
          },
        });

        if (conflicting) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This time slot is no longer available",
          });
        }

        const aggregation = await tx.creditLedgerEntry.aggregate({
          where: { userId: learnerId },
          _sum: { amount: true },
        });
        const balance = aggregation._sum.amount ?? 0;
        if (balance < teachSkill.creditCost) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: `Insufficient credit balance (have ${balance}, need ${teachSkill.creditCost})`,
          });
        }

        const booking = await tx.booking.create({
          data: {
            teachSkillId: input.teachSkillId,
            learnerId,
            teacherId: input.teacherId,
            slotStart,
            slotEnd,
            status: "REQUESTED",
            creditCost: teachSkill.creditCost,
          },
        });

        await tx.creditLedgerEntry.create({
          data: {
            userId: learnerId,
            bookingId: booking.id,
            type: "HOLD",
            amount: -teachSkill.creditCost,
            description: `Hold for ${teachSkill.skillName}`,
          },
        });

        return booking;
      });
    }),

  accept: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id!;
      return ctx.prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findUnique({ where: { id: input.id } });
        if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
        if (booking.teacherId !== userId) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only the teacher can accept bookings" });
        }
        assertAllowedTransition(booking.status, "CONFIRMED");
        return tx.booking.update({ where: { id: input.id }, data: { status: "CONFIRMED" } });
      });
    }),

  decline: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id!;
      return ctx.prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findUnique({
          where: { id: input.id },
          include: { teachSkill: true },
        });
        if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
        if (booking.teacherId !== userId) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only the teacher can decline bookings" });
        }
        assertAllowedTransition(booking.status, "DECLINED");

        const holdEntry = await tx.creditLedgerEntry.findFirst({
          where: { bookingId: input.id, type: "HOLD" },
        });

        await tx.booking.update({ where: { id: input.id }, data: { status: "DECLINED" } });

        if (holdEntry) {
          await tx.creditLedgerEntry.create({
            data: {
              userId: booking.learnerId,
              bookingId: input.id,
              type: "RELEASE",
              amount: -holdEntry.amount,
              description: `Release hold for ${booking.teachSkill.skillName}`,
            },
          });
        }

        return booking;
      });
    }),

  cancel: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id!;
      return ctx.prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findUnique({
          where: { id: input.id },
          include: { teachSkill: true },
        });
        if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
        if (booking.learnerId !== userId && booking.teacherId !== userId) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not your booking" });
        }
        assertAllowedTransition(booking.status, "CANCELLED");

        const now = new Date();
        if (booking.slotStart <= now) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Cannot cancel a booking after its session start time has passed",
          });
        }

        const holdEntry = await tx.creditLedgerEntry.findFirst({
          where: { bookingId: input.id, type: "HOLD" },
        });

        await tx.booking.update({ where: { id: input.id }, data: { status: "CANCELLED" } });

        if (holdEntry) {
          await tx.creditLedgerEntry.create({
            data: {
              userId: booking.learnerId,
              bookingId: input.id,
              type: "RELEASE",
              amount: -holdEntry.amount,
              description: `Release hold for ${booking.teachSkill.skillName}`,
            },
          });
        }

        return booking;
      });
    }),

  complete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id!;
      return ctx.prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findUnique({
          where: { id: input.id },
          include: { teachSkill: true },
        });
        if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
        if (booking.learnerId !== userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only the learner can mark a session as complete",
          });
        }
        assertAllowedTransition(booking.status, "COMPLETED");

        const holdEntry = await tx.creditLedgerEntry.findFirst({
          where: { bookingId: input.id, type: "HOLD" },
        });

        if (holdEntry) {
          await tx.creditLedgerEntry.create({
            data: {
              userId: booking.learnerId,
              bookingId: input.id,
              type: "RELEASE",
              amount: -holdEntry.amount,
              description: `Release hold for ${booking.teachSkill.skillName}`,
            },
          });
        }

        await tx.creditLedgerEntry.create({
          data: {
            userId: booking.learnerId,
            bookingId: input.id,
            type: "SETTLE_DEBIT",
            amount: -booking.creditCost,
            description: `Session completed: ${booking.teachSkill.skillName}`,
          },
        });

        await tx.creditLedgerEntry.create({
          data: {
            userId: booking.teacherId,
            bookingId: input.id,
            type: "SETTLE_CREDIT",
            amount: booking.creditCost,
            description: `Earned from ${booking.teachSkill.skillName}`,
          },
        });

        return tx.booking.update({ where: { id: input.id }, data: { status: "COMPLETED" } });
      });
    }),
});
