import { getAuth, withClerkMiddleware } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const isPublic = (path: string): boolean => {
  if (path === '/' || path.startsWith('/i/list')) {
    return true;
  }

  return false;
};

export default withClerkMiddleware((request: NextRequest) => {
  const { userId } = getAuth(request);

  // Redirect signed-in users from home to /i
  if (userId && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/i', request.url));
  }

  // Allow all other public paths
  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Redirect not authenticated users to home
  if (!userId) {
    const signInUrl = new URL('/', request.url);
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Fallback
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
