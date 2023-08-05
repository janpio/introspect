import { JSX, Suspense } from 'react';

import { LoadingIcon } from '../loading-icon';
import { ManageListData } from './manage-list-data';

export function ManageList(): JSX.Element | null {
  return (
    <Suspense fallback={<LoadingIcon count={5} />}>
      <ManageListData />
    </Suspense>
  );
}
