import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';
import { twMerge } from 'tailwind-merge';

import {
  DEFAULT_CACHE_TIME,
  DEFAULT_STALE_TIME,
  ROOT_URL,
} from '../../util/constants';
import { learningListTags, listCardTags } from '../../util/tags';
import { zodFetch } from '../../util/zod';
import { learningListReturnSchema } from '../api/learning-list/types';
import type { ListCardReturn } from '../api/list-card/types';
import { FavoriteButton } from './favorite-button';

type ListCardProperties = {
  readonly containerClassname?: string;
  readonly listId: string;
};

export function ListCard({
  containerClassname,
  listId,
}: ListCardProperties): JSX.Element {
  const { user } = useUser();

  const searchParameters = new URLSearchParams({
    listId,
  });
  if (user?.id) {
    searchParameters.append('clerkId', user.id);
  }

  const { data: listData } = useQuery({
    cacheTime: DEFAULT_CACHE_TIME,
    async queryFn() {
      const parameters = new URLSearchParams({
        listId,
      });

      if (user?.id) {
        parameters.append('clerkId', user.id);
      }

      return zodFetch(
        learningListReturnSchema,
        `${ROOT_URL}/api/learning-list?${parameters.toString()}`,
        {
          credentials: 'same-origin',
        },
      );
    },
    queryKey: learningListTags(listId),
    staleTime: DEFAULT_STALE_TIME,
    suspense: true,
  });

  const { data } = useQuery({
    cacheTime: DEFAULT_CACHE_TIME,
    enabled: typeof user?.id === 'string',
    async queryFn() {
      const response = await fetch(
        `${ROOT_URL}/api/list-card?${searchParameters.toString()}`,
        {
          credentials: 'same-origin',
          method: 'GET',
        },
      );

      return response.json() as unknown as ListCardReturn;
    },
    queryKey: listCardTags(listId),
    staleTime: DEFAULT_STALE_TIME,
    suspense: true,
  });

  const currentUserHasFavorited = data?.[1]
    ? data?.[1].favoriteLists.length > 0
    : false;

  return (
    <div
      className={twMerge(
        'flex w-full max-w-5xl justify-between border-2 p-4 shadow-sm',
        containerClassname,
      )}
    >
      <div className="grid">
        <p className="text-xl font-bold underline">
          <Link className="text-blue-900" href={`/list/${listId}`}>
            {listData?.name}
          </Link>
        </p>
        {listData?.updatedAt && (
          <time>
            Updated: {DateTime.fromISO(listData.updatedAt).toRelative()}
          </time>
        )}
        {listData?.createdAt && (
          <time>
            Created: {DateTime.fromISO(listData.createdAt).toRelative()}
          </time>
        )}
      </div>
      <div className="grid grid-cols-[55px] gap-4 md:grid-cols-55px-55px">
        <div>
          {listData?.creator.profileImageUrl && (
            <Image
              alt={`${listData?.creator.username ?? ''} profile`}
              className="rounded-full"
              height={60}
              src={listData?.creator.profileImageUrl}
              width={60}
            />
          )}
          <p className="text-center">{listData?.creator.username}</p>
        </div>
        <FavoriteButton
          clerkId={user?.id}
          favoritedCount={data?.[0]?._count.favoritedBy ?? 0}
          hasUserFavorited={currentUserHasFavorited}
          listId={listId}
        />
      </div>
    </div>
  );
}
