import { currentUser } from '@clerk/nextjs';
import { DateTime } from 'luxon';
import type { JSX } from 'react';

import { ListCard } from '../../(components)/list-card';
import {
  type LearningListFragmentReturn,
  manageQuery,
} from '../../(queries)/learning-list';
import { defaultQueryOptions } from '../../graphql/util/apollo';
import { getClient } from '../../layout';

export default async function Manage(): Promise<JSX.Element | null> {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const { data } = await getClient().query<LearningListFragmentReturn>({
    ...defaultQueryOptions,
    query: manageQuery,
    variables: {
      where: {
        creator: {
          is: {
            clerkId: {
              equals: user.id,
            },
          },
        },
      },
    },
  });

  return (
    <div className="mx-auto my-4 grid max-w-7xl place-items-center">
      <div className="w-full max-w-5xl">
        {data.learningLists.map(list => {
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
