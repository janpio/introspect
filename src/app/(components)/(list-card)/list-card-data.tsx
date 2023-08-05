'use client';
import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { isNil } from 'lodash';
import type { JSX } from 'react';
import { z } from 'zod';

import { learningListReturnSchema } from '../../api/learning-list/types';
import { listCardReturnSchema } from '../../api/list-card/types';
import {
  apiRequests,
  DEFAULT_RQ_OPTIONS,
  getRequestKey,
} from '../../data/api-requests';
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
      const response = await fetch(
        apiRequests.getLearningList(listId, user?.id),
      );

      return learningListReturnSchema.parse(await response.json());
    },
    queryKey: getRequestKey(apiRequests.getLearningList(listId, user?.id)),
  });

  const { data } = useQuery({
    ...DEFAULT_RQ_OPTIONS,
    async queryFn() {
      const response = await fetch(apiRequests.getListCard(listId, user?.id));

      return (await response.json()) as z.output<typeof listCardReturnSchema>;
    },
    queryKey: getRequestKey(apiRequests.getListCard(listId, user?.id)),
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
