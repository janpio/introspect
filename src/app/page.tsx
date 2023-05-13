import type { JSX } from 'react';

import { AnimatedText } from './(components)/animated-text';

export default function Home(): JSX.Element {
  return (
    <main className="grid h-96 w-full place-items-center">
      <div className="w-96">
        <h1 className="my-4 text-5xl font-bold italic text-blue-900">
          Introspect
        </h1>
        <AnimatedText />
        {/* <div className="my-4 flex gap-4"> */}
        {/*  <SignInButton> */}
        {/*    <Button>Learn Now</Button> */}
        {/*  </SignInButton> */}
        {/* </div> */}
      </div>
    </main>
  );
}
