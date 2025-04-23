/**
 * Adding authentication to the dashboard.
 * https://nextjs.org/learn/dashboard-app/adding-authentication
 */
import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isNotLogout = !(nextUrl.pathname === "/auth/logout");
      
      if (isOnDashboard) {
        // Only allow authenticated users on dashboard
        return isLoggedIn;
      } else if (isLoggedIn && isNotLogout) {
        // Redirect logged in users from login to dashboard
        let url = new URL('/dashboard/setup', nextUrl);
        return Response.redirect(url);
      }
      
      return true;
    },
  },
  providers: [], // The providers option is an array where you list different login options.
  //such as Google or GitHub. For this project we will use the Credentials provider only (configured in /auth.ts).
} satisfies NextAuthConfig;