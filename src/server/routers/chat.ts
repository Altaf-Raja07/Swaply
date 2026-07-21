import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { getRedis } from "@/lib/redis";

export const chatRouter = router({
  getHistory: protectedProcedure
    .input(z.object({ bookingId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id!;
      const booking = await ctx.prisma.booking.findUnique({
        where: { id: input.bookingId },
      });
      if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
      if (booking.learnerId !== userId && booking.teacherId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your booking" });
      }
      return ctx.prisma.message.findMany({
        where: { bookingId: input.bookingId },
        include: { sender: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
      });
    }),

  sendMessage: protectedProcedure
    .input(z.object({ bookingId: z.string(), content: z.string().min(1).max(2000) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user!.id!;
      const booking = await ctx.prisma.booking.findUnique({
        where: { id: input.bookingId },
        include: {
          teachSkill: { select: { skillName: true } },
          learner: { select: { name: true } },
          teacher: { select: { name: true } },
        },
      });
      if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
      if (booking.learnerId !== userId && booking.teacherId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your booking" });
      }
      const message = await ctx.prisma.message.create({
        data: { bookingId: input.bookingId, senderId: userId, content: input.content },
        include: { sender: { select: { id: true, name: true, image: true } } },
      });
      try {
        await getRedis().publish(
          "chat:message",
          JSON.stringify({ bookingId: input.bookingId, msg: message })
        );
      } catch (e) {
        console.error("Redis publish error:", e);
      }
      return message;
    }),
});
