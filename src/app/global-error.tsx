'use client';
import type { JSX } from 'react';

import { prisma } from '../prisma/database';

type GlobalErrorProperties = {
  error: Error;
  reset: () => void;
};

export default async function GlobalError({
  error,
  reset,
}: GlobalErrorProperties): Promise<JSX.Element> {
  const createdError = await prisma.error.create({
    data: {
      cause: error.cause ? JSON.stringify(error.cause) : undefined,
      message: error.message,
      name: error.name,
      stack: error.stack,
    },
    select: { id: true },
  });

  return (
    <html lang="en-US">
      <body>
        <h2>Something has gone terribly wrong!</h2>
        <p>Error Id: {createdError.id}</p>
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
