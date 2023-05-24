import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import type { JSX } from 'react';

import { ListCard } from '../(components)/list-card';
import { getClient } from '../layout';

type QueryReturn = {
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

const listPageQuery = gql`
  query LearningLists {
    learningLists {
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

export default async function ListPage(): Promise<JSX.Element> {
  const { data } = await getClient().query<QueryReturn>({
    context: { fetchOptions: { next: { revalidate: 86_400 } } },
    query: listPageQuery,
  });

  return (
    <main className="my-auto">
      <h1 className="my-4 text-center text-3xl font-bold text-blue-900">
        Top Lists
      </h1>
      <div className="grid place-items-center">
        {data.learningLists.map(async list => {
          return (
            // @ts-expect-error ListCard returns Promise
            <ListCard
              creatorProfileImage={list.creator.profileImageUrl}
              creatorUsername={list.creator.username}
              key={list.id}
              listCreatedAt={DateTime.fromISO(list.createdAt).toRelative()}
              listId={list.id}
              listName={list.name}
              listUpdatedAt={DateTime.fromISO(list.updatedAt).toRelative()}
            />
          );
        })}
      </div>
    </main>
  );
}
