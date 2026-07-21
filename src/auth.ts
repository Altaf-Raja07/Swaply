import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account && account.provider === "google") {
        const email = profile?.email as string | undefined;
        if (email) {
          let dbUser = await prisma.user.findUnique({ where: { email } });
          if (!dbUser) {
            dbUser = await prisma.$transaction(async (tx) => {
              const newUser = await tx.user.create({
                data: {
                  email,
                  name: (profile?.name as string) || email.split("@")[0],
                  image: (profile?.picture as string) || undefined,
                },
              });
              await tx.creditLedgerEntry.create({
                data: {
                  userId: newUser.id,
                  type: "SIGNUP_BONUS",
                  amount: 2,
                  description: "Welcome to Swaply — 2 bonus credits",
                },
              });
              return newUser;
            });
          }
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.name = dbUser.name;
          token.picture = dbUser.image || undefined;
          return token;
        }
      }

      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
        token.name = user.name as string;
        token.picture = user.image as string | undefined;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
