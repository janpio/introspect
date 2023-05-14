import { currentUser, SignUpButton, UserButton } from '@clerk/nextjs';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import type { JSX, ReactNode } from 'react';

import { Button } from '../(components)/(elements)/button';

type LayoutProperties = {
  children: ReactNode;
};

export default async function Layout({
  children,
}: LayoutProperties): Promise<JSX.Element> {
  const user = await currentUser();

  return (
    <>
      <nav className="mx-auto my-2 grid max-w-7xl grid-cols-1 items-center gap-4 border-b-2 py-2 shadow-sm sm:grid-cols-2 sm:px-6 lg:px-8">
        <Link className="mx-2 text-2xl font-bold text-blue-900" href="/">
          Introspect.dev
        </Link>
        <div className="mx-2 flex w-full items-center gap-4 sm:justify-end">
          {user && (
            <Button className="px-2 py-1">
              <Link className="flex items-center gap-1" href="/create">
                <PlusCircleIcon height={20} width={20} /> Create
              </Link>
            </Button>
          )}
          {!user && (
            <Button className="px-2 py-1">
              <SignUpButton>Sign Up/In</SignUpButton>
            </Button>
          )}
          <UserButton />
        </div>
      </nav>
      {children}
    </>
  );
}
