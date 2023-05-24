import { gql } from '@apollo/client';
import { currentUser } from '@clerk/nextjs';
import classNames from 'classnames';
import { isNil } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';

import { prisma } from '../../prisma/database';
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

type ListCardQuery = {
  learningList: {
    favoritedBy: Array<{ id: string }>;
  };
};

const listCardQuery = gql`
  query ExampleQuery($where: LearningListWhereUniqueInput) {
    learningList(where: $where) {
      favoritedBy {
        id
      }
    }
  }
`;

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

  const { data } = await getClient().query<ListCardQuery>({
    context: { fetchOptions: { next: { revalidate: 0 } } },
    query: listCardQuery,
    variables: {
      where: {
        id: listId,
      },
    },
  });

  const favoriteCount = data.learningList.favoritedBy.length;

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
          favoritedCount={favoriteCount ?? 0}
          hasUserFavorited={currentUserHasFavorited}
          listId={listId}
        />
      </div>
    </div>
  );
}
