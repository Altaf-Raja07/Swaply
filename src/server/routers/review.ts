import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const reviewRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        bookingId: z.string(),
        rating: z.number().int().min(1).max(5),
        comment: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id!;

      const booking = await ctx.prisma.booking.findUnique({
        where: { id: input.bookingId },
        select: { learnerId: true, teacherId: true, status: true },
      });

      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found",
        });
      }

      if (booking.status !== "COMPLETED") {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Can only review completed bookings",
        });
      }

      if (booking.learnerId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the learner can review this booking",
        });
      }

      try {
        const review = await ctx.prisma.review.create({
          data: {
            bookingId: input.bookingId,
            reviewerId: userId,
            revieweeId: booking.teacherId,
            rating: input.rating,
            comment: input.comment ?? null,
          },
        });
        return review;
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A review already exists for this booking",
          });
        }
        throw error;
      }
    }),

  getForTeacher: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.prisma.review.findMany({
        where: { revieweeId: input.userId },
        include: {
          reviewer: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      const count = reviews.length;
      const average =
        count > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
          : 0;

      return {
        reviews,
        aggregate: {
          count,
          average: Math.round(average * 10) / 10,
        },
      };
    }),

  getReviewableBookings: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user!.id!;

    const bookings = await ctx.prisma.booking.findMany({
      where: {
        learnerId: userId,
        status: "COMPLETED",
        review: null,
      },
      include: {
        teacher: { select: { id: true, name: true, image: true } },
        teachSkill: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return bookings;
  }),
});
