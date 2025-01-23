/**
 * Adding authentication to the dashboard.
 * https://nextjs.org/learn/dashboard-app/adding-authentication
 */
import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // The providers option is an array where you list different login options.
  //such as Google or GitHub. For this project we will use the Credentials provider only (configured in /auth.ts).
} satisfies NextAuthConfig;