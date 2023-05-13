import { UserButton } from '@clerk/nextjs';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import type { JSX, ReactNode } from 'react';

import { Button } from '../(components)/(elements)/button';

type LayoutProperties = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProperties): JSX.Element {
  return (
    <>
      <nav className="mx-auto my-2 flex max-w-7xl items-center gap-4 border-b-2 py-2 shadow-sm sm:px-6 lg:px-8">
        <Link className="text-2xl font-bold text-blue-900" href="/i">
          Introspect.dev
        </Link>
        <div className="flex w-full items-center justify-end gap-4">
          <Button className="px-2 py-1">
            <Link className="flex items-center gap-1" href="/i/create">
              <PlusCircleIcon height={20} width={20} /> Create
            </Link>
          </Button>
          <UserButton />
        </div>
      </nav>
      {children}
    </>
  );
}
