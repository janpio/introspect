import { currentUser } from '@clerk/nextjs';
import { isNil } from 'lodash';
import Image from 'next/image';
import type { JSX } from 'react';

import { prisma } from '../../../prisma/database';
import { FavoriteButton } from './favorite-button';

type ListCardProperties = {
  creatorProfileImage: string | null;
  creatorUsername: string | null;
  listCreatedAt: string | null;
  listId: string;
  listName: string;
  listUpdatedAt: string | null;
};

// eslint-disable-next-line unicorn/numeric-separators-style
export const revalidate = 86400;

export async function ListCard({
  creatorProfileImage,
  creatorUsername,
  listCreatedAt,
  listId,
  listName,
  listUpdatedAt,
}: ListCardProperties): Promise<JSX.Element> {
  const clerkUser = await currentUser();

  const learningLists = await prisma.learningList.findUnique({
    select: {
      favoritedBy: {
        select: { id: true },
      },
    },
    where: { id: listId },
  });
  const favoriteCount = learningLists?.favoritedBy.length;

  const user = await prisma.person.findUnique({
    select: { clerkId: true, favoriteLists: true, id: true },
    where: { clerkId: clerkUser?.id ?? '' },
  });

  let currentUserHasFavorited = false;
  if (!isNil(user)) {
    for (const favoriteList of user.favoriteLists) {
      if (favoriteList.id === listId) {
        currentUserHasFavorited = true;
        break;
      }
    }
  }

  return (
    <div className="flex w-full max-w-5xl justify-between border-2 p-4 shadow-sm">
      <div className="grid">
        <p className="text-xl font-bold underline">{listName}</p>
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
          favoritedCount={favoriteCount ?? 0}
          hasUserFavorited={currentUserHasFavorited}
          listId={listId}
        />
      </div>
    </div>
  );
}
