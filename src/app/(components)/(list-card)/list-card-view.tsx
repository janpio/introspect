import { isEmpty } from 'lodash';
import { DateTime } from 'luxon';
import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';

import { FavoriteButton } from '../favorite-button';

type ListCardViewProperties = {
  readonly data: {
    readonly createdAt: string;
    readonly creator: {
      profileImageUrl: string;
      username: string;
    };
    readonly favoriteCount: number;
    readonly hasCurrentUserFavorited: boolean;
    readonly listId: string;
    readonly name: string;
    readonly updatedAt: string;
    readonly userId?: string;
  };
};

export function ListCardView({ data }: ListCardViewProperties): JSX.Element {
  const {
    hasCurrentUserFavorited,
    userId,
    favoriteCount,
    name,
    updatedAt,
    creator,
    createdAt,
    listId,
  } = data;

  return (
    <div className="flex w-full max-w-5xl justify-between border-2 p-4 shadow-sm">
      <div className="grid">
        <p className="text-xl font-bold underline">
          <Link className="text-blue-900" href={`/list/${listId}`}>
            {name}
          </Link>
        </p>
        {!isEmpty(updatedAt) && (
          <time>Updated: {DateTime.fromISO(updatedAt).toRelative()}</time>
        )}
        {!isEmpty(createdAt) && (
          <time>Created: {DateTime.fromISO(createdAt).toRelative()}</time>
        )}
      </div>
      <div className="grid grid-cols-[55px] gap-4 md:grid-cols-55px-55px">
        <div>
          {!isEmpty(creator.profileImageUrl) && (
            <Image
              alt={`${creator.username ?? ''} profile`}
              className="rounded-full"
              height={60}
              src={creator.profileImageUrl}
              width={60}
            />
          )}
          <p className="text-center">{creator.username}</p>
        </div>
        <FavoriteButton
          clerkId={userId}
          favoritedCount={favoriteCount}
          hasUserFavorited={hasCurrentUserFavorited}
          listId={listId}
        />
      </div>
    </div>
  );
}
