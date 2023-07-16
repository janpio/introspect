'use client';
import { useQuery } from '@tanstack/react-query';
import type { JSX } from 'react';

import {
  DEFAULT_CACHE_TIME,
  DEFAULT_STALE_TIME,
  ROOT_URL,
} from '../../util/constants';
import { listPageTags } from '../../util/tags';
import { zodFetch } from '../../util/zod';
import { ListCard } from '../(components)/list-card';
import { listPageReturnSchema } from '../api/list-page/types';

export default function ListPage(): JSX.Element {
  const { data } = useQuery({
    cacheTime: DEFAULT_CACHE_TIME,
    queryFn() {
      return zodFetch(listPageReturnSchema, `${ROOT_URL}/api/list-page`, {
        credentials: 'same-origin',
      });
    },
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
