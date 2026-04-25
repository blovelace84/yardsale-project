import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { hashPassword, verifyPasswordWithMigration } from "./password";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;
        const normalizedEmail = credentials.email.trim().toLowerCase();

        const user = await db.user.findUnique({
          where: { email: normalizedEmail },
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            password: true,
          },
        });

        if (!user?.password) return null;

        const verification = await verifyPasswordWithMigration(
          credentials.password,
          user.password
        );
        if (!verification.isValid) return null;

        if (verification.shouldRehash) {
          const upgradedHash = await hashPassword(credentials.password);

          await db.user.update({
            where: { id: user.id },
            data: { password: upgradedHash },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.email = session.user.email ?? token.email ?? undefined;
        session.user.name = session.user.name ?? token.name ?? undefined;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};