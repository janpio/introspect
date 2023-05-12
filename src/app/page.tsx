import type { JSX } from 'react';

import { AnimatedText } from '@/app/(components)/animated-text';

export default function Home(): JSX.Element {
  return (
    <main className="w-full h-screen grid place-items-center">
      <div className="w-96">
        <h1 className="text-5xl font-bold my-4 italic text-blue-900">
          Introspect
        </h1>
        <AnimatedText />
      </div>
    </main>
  );
}
