import type { JSX } from 'react';

import { ListCard } from '../../../(components)/(list-card)/list-card';
import { ListDetails } from '../../../(components)/(list-details)/list-details';

type ListPageProperties = {
  readonly params: {
    id: string;
  };
};

export default function ListPage({
  params,
}: ListPageProperties): JSX.Element | null {
  return (
    <div className="grid place-items-center">
      <ListCard listId={params.id} />
      <ListDetails listId={params.id} />
    </div>
  );
}
