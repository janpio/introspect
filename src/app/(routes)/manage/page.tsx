import { currentUser } from '@clerk/nextjs';
import { DateTime } from 'luxon';
import type { JSX } from 'react';

import { prisma } from '../../../prisma/database';
import { ListCard } from '../../(components)/list-card';

export default async function Manage(): Promise<JSX.Element | null> {
  const user = await currentUser();

  if (!user) {
    return null;
  }

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
    where: {
      creator: {
        clerkId: user.id,
      },
    },
  });

  return (
    <div className="mx-auto my-4 grid max-w-7xl place-items-center">
      <div className="w-full max-w-5xl">
        {lists.map(list => {
          return (
            // @ts-expect-error Returns promise
            <ListCard
              creatorProfileImage={user.profileImageUrl}
              creatorUsername={user.username}
              key={list.id}
              listCreatedAt={DateTime.fromJSDate(list.createdAt).toRelative()}
              listId={list.id}
              listName={list.name}
              listUpdatedAt={DateTime.fromJSDate(list.updatedAt).toRelative()}
            />
          );
        })}
      </div>
    </div>
  );
}
