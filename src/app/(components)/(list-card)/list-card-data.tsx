'use client';
import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { isNil } from 'lodash';
import type { JSX } from 'react';

import { DEFAULT_RQ_OPTIONS } from '../../../actions/constants';
import { getLearningList } from '../../../actions/get-learning-list/get-learning-list';
import { getLearningListKeys } from '../../../actions/get-learning-list/types';
import { getListCard } from '../../../actions/get-list-card/get-list-card';
import { getListCardKeys } from '../../../actions/get-list-card/types';
import { ListCardView } from './list-card-view';

type ListCardProperties = {
  readonly listId: string;
};

export function ListCardData({
  listId,
}: ListCardProperties): JSX.Element | null {
  const { user } = useUser();

  const { data: listData } = useQuery({
    ...DEFAULT_RQ_OPTIONS,
    async queryFn() {
      return getLearningList(listId);
    },
    queryKey: getLearningListKeys(listId),
  });

  const { data } = useQuery({
    ...DEFAULT_RQ_OPTIONS,
    async queryFn() {
      return getListCard(listId);
    },
    queryKey: getListCardKeys(listId),
  });

  const hasCurrentUserFavorited = data?.[1]?.favoriteLists
    ? data?.[1].favoriteLists.length > 0
    : false;

  if (isNil(listData) || isNil(data)) {
    return null;
  }

  return (
    <ListCardView
      data={{
        createdAt: listData.createdAt,
        creator: {
          profileImageUrl: listData.creator.profileImageUrl,
          username: listData.creator.username,
        },
        favoriteCount: data?.[0]?._count?.favoritedBy ?? 0,
        hasCurrentUserFavorited,
        listId,
        name: listData.name,
        updatedAt: listData.updatedAt,
        userId: user?.id,
      }}
    />
  );
}
