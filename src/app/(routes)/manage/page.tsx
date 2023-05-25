import { currentUser } from '@clerk/nextjs';
import { DateTime } from 'luxon';
import type { JSX } from 'react';

import { ROOT_URL } from '../../../util/constants';
import { zodFetch } from '../../../util/zod';
import { ListCard } from '../../(components)/list-card';
import { manageListsReturnSchema } from '../../api/manage-lists/types';

export default async function Manage(): Promise<JSX.Element | null> {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const searchParameters = new URLSearchParams({
    clerkId: user.id,
  });
  const data = await zodFetch(
    manageListsReturnSchema,
    `${ROOT_URL}/api/manage-lists?${searchParameters.toString()}`,
    {
      credentials: 'same-origin',
      next: { revalidate: 86_400, tags: [`manage-lists-${user.id}`] },
    },
  );

  return (
    <div className="mx-auto my-4 grid max-w-7xl place-items-center">
      <div className="w-full max-w-5xl">
        {data.map(list => {
          return (
            // @ts-expect-error Returns promise
            <ListCard
              creatorProfileImage={user.profileImageUrl}
              creatorUsername={user.username}
              key={list.id}
              listCreatedAt={DateTime.fromISO(list.createdAt).toRelative()}
              listId={list.id}
              listName={list.name}
              listUpdatedAt={DateTime.fromISO(list.updatedAt).toRelative()}
            />
          );
        })}
      </div>
    </div>
  );
}
