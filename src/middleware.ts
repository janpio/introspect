import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export default authMiddleware({
  afterAuth(auth, request) {
    if (
      !auth.userId &&
      !auth.isPublicRoute &&
      !request.nextUrl.pathname.startsWith('/list')
    ) {
      const landingPage = new URL('/landing', request.url);
      landingPage.searchParams.set('redirect_url', request.url);
      return NextResponse.redirect(landingPage);
    }
  },
  publicRoutes: ['/landing'],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)'],
};
