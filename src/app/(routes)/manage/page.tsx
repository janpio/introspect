'use client';
import { useUser } from '@clerk/nextjs';
import type { JSX } from 'react';
import { Fragment } from 'react';

import { DEFAULT_CACHE_TIME } from '../../../util/constants';
import { useFetch } from '../../../util/use-fetch';
import { ListCard } from '../../(components)/list-card';
import { manageListsReturnSchema } from '../../api/manage-lists/types';
import { apiRequests } from '../../data/api-requests';
import { CreateListForm } from './(components)/create-list-form';
import { DeleteListModal } from './(components)/delete-list-modal';

export default function Manage(): JSX.Element | null {
  const { user } = useUser();

  const { data } = useFetch(manageListsReturnSchema, {
    cacheInterval: DEFAULT_CACHE_TIME,
    request: apiRequests.getManageLists(user?.id ?? ''),
  });

  if (!user) {
    return null;
  }

  return (
    <div className="grid place-items-center">
      <div className="grid w-full max-w-5xl gap-2">
        <CreateListForm clerkId={user.id} />
        {data?.map(list => {
          return (
            <Fragment key={list.id}>
              <ListCard listId={list.id} />
              <DeleteListModal listId={list.id} listTitle={list.name} />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
