import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import type { JSX } from 'react';

import { ListCard } from '../(components)/list-card';
import { getClient } from '../layout';

type QueryReturn = {
  allLearningLists: {
    nodes: Array<{
      createdAt: string;
      id: string;
      name: string;
      personByCreaterId: { profileImageUrl: string; username: string };
      updatedAt: string;
    }>;
  };
};

const query = gql`
  query LearningLists {
    allLearningLists {
      nodes {
        createdAt
        personByCreaterId {
          profileImageUrl
          username
        }
        id
        name
        updatedAt
      }
    }
  }
`;

export default async function ListPage(): Promise<JSX.Element> {
  const { data } = await getClient().query<QueryReturn>({
    context: { fetchOptions: { next: { revalidate: 86_400 } } },
    query,
  });

  return (
    <main className="my-auto">
      <h1 className="my-4 text-center text-3xl font-bold text-blue-900">
        Top Lists
      </h1>
      <div className="grid place-items-center">
        {data.allLearningLists.nodes.map(async list => {
          return (
            // @ts-expect-error ListCard returns Promise
            <ListCard
              creatorProfileImage={list.personByCreaterId.profileImageUrl}
              creatorUsername={list.personByCreaterId.username}
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
