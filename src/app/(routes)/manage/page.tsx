import type { JSX } from 'react';

import { ManageList } from '../../(components)/(manage-list)/manage-list';

export default function Manage(): JSX.Element | null {
  return (
    <div className="grid place-items-center">
      <div className="grid w-full max-w-5xl gap-2">
        <ManageList />
      </div>
    </div>
  );
}
