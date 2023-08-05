import type { JSX } from 'react';
import { Suspense } from 'react';

import { LoadingIcon } from '../loading-icon';
import { ListCardData } from './list-card-data';

type ListCardProperties = {
  readonly listId: string;
};

export function ListCard({ listId }: ListCardProperties): JSX.Element | null {
  return (
    <Suspense fallback={<LoadingIcon count={5} />}>
      <ListCardData listId={listId} />
    </Suspense>
  );
}
