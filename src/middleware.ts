import { getAuth, withClerkMiddleware } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const isPublic = (path: string): boolean => {
  return path === '/landing' || path.startsWith('/list');
};

export default withClerkMiddleware((request: NextRequest) => {
  const { userId } = getAuth(request);

  // Redirect signed-in users from landing to home
  if (userId && request.nextUrl.pathname === '/landing') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow all public paths
  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Redirect not authenticated users to home
  if (!userId) {
    const signInUrl = new URL('/landing', request.url);
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Fallback
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
