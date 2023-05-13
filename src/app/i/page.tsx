import { DateTime } from 'luxon';
import type { JSX } from 'react';

import { prisma } from '../../prisma/database';
import { ListCard } from './(components)/list-card';

// eslint-disable-next-line unicorn/numeric-separators-style
export const revalidate = 86400;

export default async function ListPage(): Promise<JSX.Element> {
  const lists = await prisma.learningList.findMany({
    select: {
      createdAt: true,
      creator: {
        select: {
          profileImageUrl: true,
          username: true,
        },
      },
      id: true,
      name: true,
      updatedAt: true,
    },
  });

  return (
    <main className="my-auto">
      <h1 className="my-4 text-center text-3xl font-bold text-blue-900">
        Top Lists
      </h1>
      <div className="grid place-items-center">
        {lists.map(async list => {
          return (
            // @ts-expect-error This is ok
            <ListCard
              creatorProfileImage={list.creator.profileImageUrl}
              creatorUsername={list.creator.username}
              key={list.id}
              listId={list.id}
              listName={list.name}
              listCreatedAt={DateTime.fromISO(
                list.createdAt.toISOString(),
              ).toRelative()}
              listUpdatedAt={DateTime.fromISO(
                list.updatedAt.toISOString(),
              ).toRelative()}
            />
          );
        })}
      </div>
    </main>
  );
}
