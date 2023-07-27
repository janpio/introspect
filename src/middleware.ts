import { authMiddleware } from '@clerk/nextjs/server';
import { isNil } from 'lodash';
import { NextResponse } from 'next/server';

export default authMiddleware({
  afterAuth(auth, request) {
    if (isNil(auth.userId) && !auth.isPublicRoute) {
      const landingPage = new URL('/landing', request.url);
      landingPage.searchParams.set('redirect_url', request.url);
      return NextResponse.redirect(landingPage);
    }

    if (!isNil(auth.userId) && request.nextUrl.pathname === '/landing') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  },
  publicRoutes: ['/landing', '/list/(.*)', '/api(.*)'],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)'],
};
