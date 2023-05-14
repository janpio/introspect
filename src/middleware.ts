import { authMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default authMiddleware({
  afterAuth(auth, request) {
    if (!auth.userId && !auth.isPublicRoute) {
      const landingPage = new URL('/landing', request.url);
      landingPage.searchParams.set('redirect_url', request.url);
      return NextResponse.redirect(landingPage);
    }
  },
  publicRoutes: ['/landing', '/list/(.*)'],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)'],
};
