'use client';
import { useUser } from '@clerk/nextjs';
import { isNil } from 'lodash';
import type { JSX } from 'react';
import { Fragment, Suspense } from 'react';

import { DEFAULT_CACHE_TIME } from '../../../util/constants';
import { useFetch } from '../../../util/use-fetch';
import { ListCard } from '../../(components)/list-card';
import { LoadingIcon } from '../../(components)/loading-icon';
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

  return (
    <Suspense fallback={<LoadingIcon count={30} />}>
      <div className="grid place-items-center">
        <div className="grid w-full max-w-5xl gap-2">
          {!isNil(user) && <CreateListForm clerkId={user.id} />}
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
    </Suspense>
  );
}
