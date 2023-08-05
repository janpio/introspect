'use client';
import { useQuery } from '@tanstack/react-query';
import { isNil } from 'lodash';
import React, { JSX } from 'react';

import { listPageReturnSchema } from '../../api/list-page/types';
import {
  apiRequests,
  DEFAULT_RQ_OPTIONS,
  getRequestKey,
} from '../../data/api-requests';
import { ListCard } from '../(list-card)/list-card';

export function ListCardsData(): JSX.Element | null {
  const { data } = useQuery({
    ...DEFAULT_RQ_OPTIONS,
    async queryFn() {
      const response = await fetch(apiRequests.getListPage());

      return listPageReturnSchema.parse(await response.json());
    },
    queryKey: getRequestKey(apiRequests.getListPage()),
  });

  if (isNil(data)) {
    return null;
  }

  return (
    <>
      {data.map(async list => {
        return <ListCard key={list.id} listId={list.id} />;
      })}
    </>
  );
}
