import { currentUser } from '@clerk/nextjs';
import { DateTime } from 'luxon';
import type { JSX } from 'react';
import { Fragment } from 'react';

import { ROOT_URL } from '../../../util/constants';
import { manageListsTags } from '../../../util/tags';
import { zodFetch } from '../../../util/zod';
import { ListCard } from '../../(components)/list-card';
import { manageListsReturnSchema } from '../../api/manage-lists/types';
import { CreateListForm } from './(components)/create-list-form';
import { DeleteListModal } from './(components)/delete-list-modal';

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
      next: { tags: manageListsTags(user.id) },
    },
  );

  return (
    <div className="grid place-items-center">
      <div className="grid w-full max-w-5xl gap-2">
        <CreateListForm clerkId={user.id} />
        {data.map(list => {
          return (
            <Fragment key={list.id}>
              {/* @ts-expect-error Returns promise */}
              <ListCard
                creatorProfileImage={user.imageUrl}
                creatorUsername={user.username}
                listCreatedAt={DateTime.fromISO(list.createdAt).toRelative()}
                listId={list.id}
                listName={list.name}
                listUpdatedAt={DateTime.fromISO(list.updatedAt).toRelative()}
              />
              <DeleteListModal listId={list.id} listTitle={list.name} />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
