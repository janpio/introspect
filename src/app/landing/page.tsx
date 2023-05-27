import { SignInButton } from '@clerk/nextjs';
import type { JSX } from 'react';

import { environment } from '../../util/environment';
import { AnimatedText } from '../(components)/(animated-element)/animated-text';
import { Button } from '../(components)/(elements)/button';

export default function Home(): JSX.Element {
  return (
    <main className="mx-2 grid h-96 place-items-center">
      <div className="w-96">
        <h1 className="my-4 text-5xl font-bold italic text-white">
          Introspect.dev
        </h1>
        <AnimatedText />
        {environment.NODE_ENV === 'development' && (
          <div className="my-4 flex gap-4">
            <SignInButton>
              <Button>Learn Now</Button>
            </SignInButton>
          </div>
        )}
      </div>
    </main>
  );
}
