'use client';
import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { isNil } from 'lodash';
import type { JSX } from 'react';

import { api, DEFAULT_RQ_OPTIONS, getRequestKey } from '../../api/api';
import { learningListReturnSchema } from '../../api/learning-list/types';
import type { GetListCardReturn } from '../../api/list-card/types';
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
      const data = await fetch(api.getList(listId, user?.id));

      return learningListReturnSchema.parse(await data.json());
    },
    queryKey: getRequestKey(api.getList(listId)),
  });

  const { data } = useQuery({
    ...DEFAULT_RQ_OPTIONS,
    async queryFn() {
      const response = await fetch(api.getListCard(listId, user?.id));
      return (await response.json()) as GetListCardReturn;
    },
    queryKey: getRequestKey(api.getListCard(listId)),
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
