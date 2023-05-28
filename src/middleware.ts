import { authMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default authMiddleware({
  afterAuth(auth, request) {
    if (!auth.userId && request.method !== 'GET') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        {
          status: 401,
        },
      );
    }

    if (!auth.userId && !auth.isPublicRoute) {
      const landingPage = new URL('/landing', request.url);
      landingPage.searchParams.set('redirect_url', request.url);
      return NextResponse.redirect(landingPage);
    }

    if (auth.userId && request.nextUrl.pathname === '/landing') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  },
  publicRoutes: ['/landing', '/list/(.*)', '/api(.*)'],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)'],
};
