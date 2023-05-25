import { currentUser } from '@clerk/nextjs';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';

import { ROOT_URL } from '../../util/constants';
import type { ListCardReturn } from '../api/list-card/types';
import { FavoriteButton } from './favorite-button';

type ListCardProperties = {
  containerClassname?: string;
  creatorProfileImage: string | null;
  creatorUsername: string | null;
  listCreatedAt: string | null;
  listId: string;
  listName: string;
  listUpdatedAt: string | null;
};

export async function ListCard({
  containerClassname,
  creatorProfileImage,
  creatorUsername,
  listCreatedAt,
  listId,
  listName,
  listUpdatedAt,
}: ListCardProperties): Promise<JSX.Element> {
  const clerkUser = await currentUser();

  const searchParameters = new URLSearchParams({
    clerkId: clerkUser?.id ?? '',
    listId,
  });
  const response = await fetch(
    `${ROOT_URL}/api/list-card?${searchParameters.toString()}`,
    {
      credentials: 'same-origin',
      method: 'GET',
      next: {
        revalidate: 86_400,
        tags: ['listCard'],
      },
    },
  );
  const [learningList, person] = (await response.json()) as ListCardReturn;

  const currentUserHasFavorited = person
    ? person.favoriteLists.length > 0
    : false;

  return (
    <div
      className={classNames(
        'flex w-full max-w-5xl justify-between border-2 p-4 shadow-sm',
        containerClassname,
      )}
    >
      <div className="grid">
        <p className="text-xl font-bold underline">
          <Link className="text-blue-900" href={`/list/${listId}`}>
            {listName}
          </Link>
        </p>
        {listUpdatedAt && <time>Updated: {listUpdatedAt}</time>}
        {listCreatedAt && <time>Created: {listCreatedAt}</time>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          {creatorProfileImage && (
            <Image
              alt={`${creatorUsername ?? ''} profile`}
              className="rounded-full"
              height={60}
              src={creatorProfileImage}
              width={60}
            />
          )}
          <p>{creatorUsername}</p>
        </div>
        <FavoriteButton
          clerkId={clerkUser?.id}
          favoritedCount={learningList?._count.favoritedBy ?? 0}
          hasUserFavorited={currentUserHasFavorited}
          listId={listId}
        />
      </div>
    </div>
  );
}
