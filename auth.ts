import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { connectToDatabase } from "@/app/lib/connect-to-database";
import type { User } from "@/app/lib/definitions";
import argon2 from "argon2";


async function getUser(email: string): Promise<User | undefined> {
    const client = await connectToDatabase();

  try {
    const { rows } = await client.query(`SELECT * FROM users WHERE email=$1`, [email]);
    return rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            const user = await getUser(email);
            if (!user) return null;
            const passwordsMatch = await argon2.verify(user.password, password);
            
            if (passwordsMatch) return user;
        }
 
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the ID from the token to the session object
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
