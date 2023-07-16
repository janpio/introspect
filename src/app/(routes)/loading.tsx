import type { JSX } from 'react';

import { LoadingIcon } from '../(components)/loading-icon';

export default function Loading(): JSX.Element {
  return (
    <main className="my-4 w-full">
      <LoadingIcon />
    </main>
  );
}
