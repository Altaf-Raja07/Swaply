import { router, publicProcedure } from "../trpc";
import { authRouter } from "./auth";
import { profileRouter } from "./profile";
import { teachSkillRouter } from "./teach-skill";
import { learnGoalRouter } from "./learn-goal";

export const appRouter = router({
  auth: authRouter,
  profile: profileRouter,
  teachSkill: teachSkillRouter,
  learnGoal: learnGoalRouter,
  ping: router({
    ping: publicProcedure.query(() => "pong"),
  }),
});

export type AppRouter = typeof appRouter;
