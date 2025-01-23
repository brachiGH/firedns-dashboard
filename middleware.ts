import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
/* d routes will not even start rendering until the Middleware verifies the authentication,
The advantage of employing Middleware for this task is that the protecte
enhancing both the security and performance of your application.
*/

export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};