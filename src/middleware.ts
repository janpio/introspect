import { getAuth, withClerkMiddleware } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const publicPaths = ['/'];

const isPublic = (path: string): string | undefined => {
  return publicPaths.find(item => {
    return new RegExp(`^${item}$`.replace('*$', '($|/)')).exec(path);
  });
};

export default withClerkMiddleware((request: NextRequest) => {
  const { userId } = getAuth(request);

  if (userId && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/i', request.url));
  }

  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (!userId) {
    // redirect the users to /pages/sign-in/[[...index]].ts
    const signInUrl = new URL('/', request.url);
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
