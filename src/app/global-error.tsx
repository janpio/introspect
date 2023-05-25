'use client';
import type { JSX } from 'react';

type GlobalErrorProperties = {
  error: Error;
  reset: () => void;
};

export default async function GlobalError({
  reset,
}: GlobalErrorProperties): Promise<JSX.Element> {
  return (
    <html lang="en-US">
      <body>
        <h2>Something has gone terribly wrong!</h2>
        <button
          type="button"
          onClick={(): void => {
            reset();
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
