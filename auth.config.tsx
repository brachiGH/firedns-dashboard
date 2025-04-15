/**
 * Adding authentication to the dashboard.
 * https://nextjs.org/learn/dashboard-app/adding-authentication
 */
import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnLogin = nextUrl.pathname === '/auth/login';
      
      if (isOnDashboard) {
        // Only allow authenticated users on dashboard
        return isLoggedIn;
      } else if (isOnLogin && isLoggedIn) {
        // Redirect logged in users from login to dashboard
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      
      return true;
    },
  },
  providers: [], // The providers option is an array where you list different login options.
  //such as Google or GitHub. For this project we will use the Credentials provider only (configured in /auth.ts).
} satisfies NextAuthConfig;