import type { JSX } from 'react';
import { Suspense } from 'react';

import { LoadingIcon } from '../loading-icon';
import { ListDetailsData } from './list-details-data';

type ListDetailsProperties = {
  readonly listId: string;
};

export function ListDetails({ listId }: ListDetailsProperties): JSX.Element {
  return (
    <Suspense fallback={<LoadingIcon count={5} />}>
      <ListDetailsData listId={listId} />
    </Suspense>
  );
}
