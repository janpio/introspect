'use client';
import { useQuery } from '@tanstack/react-query';
import { isNil } from 'lodash';
import type { JSX } from 'react';
import React from 'react';

import { api, DEFAULT_RQ_OPTIONS, getRequestKey } from '../../api/api';
import { getListPageReturnSchema } from '../../api/list-page/types';
import { ListCard } from '../(list-card)/list-card';

export function ListCardsData(): JSX.Element | null {
  const { data } = useQuery({
    ...DEFAULT_RQ_OPTIONS,
    async queryFn() {
      const response = await fetch(api.getListPage());

      return getListPageReturnSchema.parse(await response.json());
    },
    queryKey: getRequestKey(api.getListPage()),
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
