'use client';
import { isNil } from 'lodash';
import type { JSX } from 'react';
import Skeleton from 'react-loading-skeleton';

import { DEFAULT_CACHE_TIME } from '../../util/constants';
import { useFetch } from '../../util/use-fetch';
import { ListCard } from '../(components)/list-card';
import { listPageReturnSchema } from '../api/list-page/types';
import { apiRequests } from '../data/api-requests';

export default function ListPage(): JSX.Element {
  const { data } = useFetch(listPageReturnSchema, {
    cacheInterval: DEFAULT_CACHE_TIME,
    request: apiRequests.getListPage(),
  });

  return (
    <>
      <h1 className="my-4 text-center text-3xl font-bold text-blue-900">
        Top Lists
      </h1>
      <div className="grid place-items-center gap-2">
        {isNil(data) && (
          <div className="w-full max-w-5xl">
            <Skeleton count={30} />
          </div>
        )}
        {data?.map(async list => {
          return <ListCard key={list.id} listId={list.id} />;
        })}
      </div>
    </>
  );
}
