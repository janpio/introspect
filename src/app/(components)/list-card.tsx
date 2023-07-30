import { useUser } from '@clerk/nextjs';
import { isEmpty, isNil } from 'lodash';
import { DateTime } from 'luxon';
import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';
import Skeleton from 'react-loading-skeleton';
import { twMerge } from 'tailwind-merge';

import { DEFAULT_CACHE_TIME } from '../../util/constants';
import { useFetch } from '../../util/use-fetch';
import { learningListReturnSchema } from '../api/learning-list/types';
import { listCardReturnSchema } from '../api/list-card/types';
import { apiRequests } from '../data/api-requests';
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

  const { data: listData } = useFetch(learningListReturnSchema, {
    cacheInterval: DEFAULT_CACHE_TIME,
    request: apiRequests.getLearningList(listId, user?.id),
  });

  const { data } = useFetch(listCardReturnSchema, {
    cacheInterval: DEFAULT_CACHE_TIME,
    request: apiRequests.getListCard(listId, user?.id),
  });

  const currentUserHasFavorited = data?.[1].favoriteLists
    ? data?.[1].favoriteLists.length > 0
    : false;

  if (isNil(listData) && isNil(data)) {
    return (
      <div className="w-full max-w-5xl">
        <Skeleton count={5} />{' '}
      </div>
    );
  }

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
        {!isNil(listData) && !isEmpty(listData.updatedAt) && (
          <time>
            Updated: {DateTime.fromISO(listData.updatedAt).toRelative()}
          </time>
        )}
        {!isNil(listData) && !isEmpty(listData.createdAt) && (
          <time>
            Created: {DateTime.fromISO(listData.createdAt).toRelative()}
          </time>
        )}
      </div>
      <div className="grid grid-cols-[55px] gap-4 md:grid-cols-55px-55px">
        <div>
          {!isNil(listData) && !isEmpty(listData.creator.profileImageUrl) && (
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
          favoritedCount={data?.[0]?._count?.favoritedBy ?? 0}
          hasUserFavorited={currentUserHasFavorited}
          listId={listId}
        />
      </div>
    </div>
  );
}
