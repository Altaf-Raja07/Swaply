import { router, publicProcedure } from "../trpc";
import { authRouter } from "./auth";

export const appRouter = router({
  auth: authRouter,
  ping: router({
    ping: publicProcedure.query(() => "pong"),
  }),
});

export type AppRouter = typeof appRouter;
