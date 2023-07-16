'use client';
import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import type { JSX } from 'react';
import { Fragment } from 'react';

import {
  DEFAULT_CACHE_TIME,
  DEFAULT_STALE_TIME,
  ROOT_URL,
} from '../../../util/constants';
import { manageListsTags } from '../../../util/tags';
import { zodFetch } from '../../../util/zod';
import { ListCard } from '../../(components)/list-card';
import { manageListsReturnSchema } from '../../api/manage-lists/types';
import { CreateListForm } from './(components)/create-list-form';
import { DeleteListModal } from './(components)/delete-list-modal';

export default function Manage(): JSX.Element | null {
  const { user } = useUser();

  const searchParameters = new URLSearchParams({
    clerkId: user ? user.id : '',
  });
  const { data } = useQuery({
    cacheTime: DEFAULT_CACHE_TIME,
    enabled: Boolean(user),
    queryFn() {
      return zodFetch(
        manageListsReturnSchema,
        `${ROOT_URL}/api/manage-lists?${searchParameters.toString()}`,
        {
          credentials: 'same-origin',
        },
      );
    },
    queryKey: manageListsTags(user?.id ?? ''),
    staleTime: DEFAULT_STALE_TIME,
    suspense: true,
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
