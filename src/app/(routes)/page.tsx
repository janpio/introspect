'use client';
import { useQuery } from '@tanstack/react-query';
import type { JSX } from 'react';

import { DEFAULT_CACHE_TIME, DEFAULT_STALE_TIME } from '../../util/constants';
import { ListCard } from '../(components)/list-card';
import { api } from '../data/api';
import { listPageTags } from '../data/tags';

export default function ListPage(): JSX.Element {
  const { data } = useQuery({
    cacheTime: DEFAULT_CACHE_TIME,
    queryFn: api.listPage,
    queryKey: listPageTags(),
    staleTime: DEFAULT_STALE_TIME,
    suspense: true,
  });

  return (
    <>
      <h1 className="my-4 text-center text-3xl font-bold text-blue-900">
        Top Lists
      </h1>
      <div className="grid place-items-center gap-2">
        {data?.map(async list => {
          return <ListCard key={list.id} listId={list.id} />;
        })}
      </div>
    </>
  );
}
