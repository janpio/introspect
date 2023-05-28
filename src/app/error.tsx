'use client';
import Link from 'next/link';
import type { JSX } from 'react';

export default async function ErrorPage(): Promise<JSX.Element> {
  return (
    <main>
      <div className="text-center text-white">
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
          Error!
        </h1>
        <p className="mt-6 text-base leading-7">Something went wrong!</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            href="/"
          >
            Go back home
          </Link>
        </div>
      </div>
    </main>
  );
}
