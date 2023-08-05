import { JSX, Suspense } from 'react';

import { LoadingIcon } from '../loading-icon';
import { ListCardsData } from './list-cards-data';

export function ListCards(): JSX.Element {
  return (
    <Suspense fallback={<LoadingIcon count={5} />}>
      <ListCardsData />
    </Suspense>
  );
}
