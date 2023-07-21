'use client';
import type { JSX } from 'react';

import { ListCard } from '../../../(components)/list-card';
import { CardList } from './(components)/card-list';

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
      <CardList listId={params.id} />
    </div>
  );
}
