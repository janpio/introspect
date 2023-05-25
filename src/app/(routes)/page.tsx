import { DateTime } from 'luxon';
import type { JSX } from 'react';

import { ListCard } from '../(components)/list-card';
import {
  type LearningListFragmentReturn,
  listPageQuery,
} from '../(queries)/learning-list';
import { defaultQueryOptions } from '../graphql/util/apollo';
import { getClient } from '../layout';

export default async function ListPage(): Promise<JSX.Element> {
  const { data } = await getClient().query<LearningListFragmentReturn>({
    ...defaultQueryOptions,
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
