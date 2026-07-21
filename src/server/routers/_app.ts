import { router, publicProcedure } from "../trpc";
import { authRouter } from "./auth";
import { profileRouter } from "./profile";
import { teachSkillRouter } from "./teach-skill";
import { learnGoalRouter } from "./learn-goal";
import { availabilityRouter } from "./availability";
import { bookingRouter } from "./booking";
import { ledgerRouter } from "./ledger";
import { chatRouter } from "./chat";
import { reviewRouter } from "./review";

export const appRouter = router({
  auth: authRouter,
  profile: profileRouter,
  teachSkill: teachSkillRouter,
  learnGoal: learnGoalRouter,
  availability: availabilityRouter,
  booking: bookingRouter,
  ledger: ledgerRouter,
  chat: chatRouter,
  review: reviewRouter,
  ping: router({
    ping: publicProcedure.query(() => "pong"),
  }),
});

export type AppRouter = typeof appRouter;
