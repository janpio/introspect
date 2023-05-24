import { gql } from '@apollo/client';
import { currentUser } from '@clerk/nextjs';
import { DateTime } from 'luxon';
import type { JSX } from 'react';

import { ListCard } from '../../(components)/list-card';
import { getClient } from '../../layout';

type ManageQuery = {
  learningLists: Array<{
    createdAt: string;
    createrId: string;
    creator: {
      profileImageUrl: string;
      username: string;
    };
    id: string;
    name: string;
    updatedAt: string;
  }>;
};

const manageQuery = gql`
  query Manage($where: LearningListWhereInput) {
    learningLists(where: $where) {
      createdAt
      createrId
      creator {
        profileImageUrl
        username
      }
      id
      name
      updatedAt
    }
  }
`;

export default async function Manage(): Promise<JSX.Element | null> {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const { data } = await getClient().query<ManageQuery>({
    context: { fetchOptions: { next: { revalidate: 86_400 } } },
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
