'use client';
import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { isNil } from 'lodash';
import { Fragment, JSX } from 'react';

import { CreateListForm } from '../../(routes)/manage/(components)/create-list-form';
import { DeleteListModal } from '../../(routes)/manage/(components)/delete-list-modal';
import { manageListsReturnSchema } from '../../api/manage-lists/types';
import {
  apiRequests,
  DEFAULT_RQ_OPTIONS,
  getRequestKey,
} from '../../data/api-requests';
import { ListCard } from '../(list-card)/list-card';

export function ManageListData(): JSX.Element {
  const { user } = useUser();

  const { data } = useQuery({
    ...DEFAULT_RQ_OPTIONS,
    enabled: !isNil(user?.id),
    async queryFn() {
      if (user?.id !== undefined) {
        const response = await fetch(apiRequests.getManageLists(user.id));

        return manageListsReturnSchema.parse(await response.json());
      }
    },
    queryKey: getRequestKey(apiRequests.getManageLists(user?.id ?? '')),
  });

  return (
    <>
      {isNil(user) ? null : <CreateListForm clerkId={user.id} />}
      {!isNil(data) &&
        data?.map(list => {
          return (
            <Fragment key={list.id}>
              <ListCard listId={list.id} />
              <DeleteListModal listId={list.id} listTitle={list.name} />
            </Fragment>
          );
        })}
    </>
  );
}
