'use client';
import type { JSX } from 'react';

import { ROOT_URL } from '../util/constants';
import { zodFetch } from '../util/zod';
import {
  createErrorBodySchema,
  createErrorReturnSchema,
} from './api/create-error/types';

type GlobalErrorProperties = {
  error: Error;
  reset: () => void;
};

export default async function GlobalError({
  error,
  reset,
}: GlobalErrorProperties): Promise<JSX.Element> {
  const createdError = await zodFetch(
    createErrorReturnSchema,
    `${ROOT_URL}/api/create-error`,
    {
      body: JSON.stringify(createErrorBodySchema.parse(error)),
      method: 'POST',
    },
  );

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
