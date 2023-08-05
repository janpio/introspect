'use client';
import { useQuery } from '@tanstack/react-query';
import { isNil } from 'lodash';
import React, { JSX } from 'react';

import { DEFAULT_RQ_OPTIONS } from '../../../actions/constants';
import { getListPage } from '../../../actions/get-list-page/get-list-page';
import { getListPageQueryKeys } from '../../../actions/get-list-page/types';
import { ListCard } from '../(list-card)/list-card';

export function ListCardsData(): JSX.Element | null {
  const { data } = useQuery({
    ...DEFAULT_RQ_OPTIONS,
    queryFn() {
      return getListPage();
    },
    queryKey: getListPageQueryKeys,
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
