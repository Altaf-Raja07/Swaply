import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { prisma } from "@/lib/prisma";

export const createContext = async () => {
  return { prisma };
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
