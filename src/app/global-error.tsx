'use client';
import type { JSX } from 'react';

type GlobalErrorProperties = {
  error: Error;
  reset: () => void;
};

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProperties): JSX.Element {
  return (
    <html lang="en-US">
      <body>
        <h2>Something has gone terribly wrong!</h2>
        <p>Does this mean anything to you?</p>
        <p>{error.name}</p>
        <p>{error.message}</p>
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
