import { currentUser } from '@clerk/nextjs';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';

import {
  listCardQuery,
  type ListCardQueryReturn,
} from '../(queries)/learning-list-person';
import { getClient } from '../layout';
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

  const { data } = await getClient().query<ListCardQueryReturn>({
    context: {
      fetchOptions: { next: { revalidate: 0, tags: ['listCardQuery'] } },
    },
    query: listCardQuery,
    variables: {
      favoriteListsWhere: {
        id: { equals: listId },
      },
      learningListWhere: {
        id: listId,
      },
      personWhere: {
        clerkId: clerkUser?.id,
      },
    },
  });

  const currentUserHasFavorited = data.person
    ? data.person.favoriteLists.length > 0
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
          favoritedCount={data.learningList._count.favoritedBy}
          hasUserFavorited={currentUserHasFavorited}
          listId={listId}
        />
      </div>
    </div>
  );
}
