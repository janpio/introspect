import { ArrowPathIcon } from '@heroicons/react/24/solid';
import type { JSX } from 'react';

export default function Loading(): JSX.Element {
  return (
    <main className="my-4 w-full">
      <ArrowPathIcon className="mx-auto h-36 w-36 animate-spin" />
    </main>
  );
}
