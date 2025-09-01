import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";
import { schema } from "./schema";
import bcrypt from "bcryptjs";

const adapter = PrismaAdapter(db);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  session: { strategy: "database" },
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedCredentials = schema.parse(credentials);

        const user = await db.user.findUnique({
          where: { email: validatedCredentials.email.toLowerCase() },
        });

        if (!user) throw new Error("Invalid credentials.");

        const isValid = await bcrypt.compare(
          validatedCredentials.password,
          user.password
        );

        if (!isValid) throw new Error("Invalid credentials.");

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      if (account?.provider === "credentials") token.credentials = true;

      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },

  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) throw new Error("No user ID found in token");

        const createdSession = await adapter?.createSession?.({
          sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) throw new Error("Failed to create session");

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
});
