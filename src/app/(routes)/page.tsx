import { DateTime } from 'luxon';
import type { JSX } from 'react';

import { ROOT_URL } from '../../util/constants';
import { listPageTags } from '../../util/tags';
import { zodFetch } from '../../util/zod';
import { ListCard } from '../(components)/list-card';
import { listPageReturnSchema } from '../api/list-page/types';

export default async function ListPage(): Promise<JSX.Element> {
  const data = await zodFetch(
    listPageReturnSchema,
    `${ROOT_URL}/api/list-page`,
    {
      credentials: 'same-origin',
      next: { tags: listPageTags() },
    },
  );

  return (
    <>
      <h1 className="my-4 text-center text-3xl font-bold text-blue-900">
        Top Lists
      </h1>
      <div className="grid place-items-center gap-2">
        {data.map(async list => {
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
    </>
  );
}
