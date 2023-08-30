'use client';
import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { isNil } from 'lodash';
import type { JSX } from 'react';
import { Fragment } from 'react';

import { CreateListForm } from '../../(routes)/manage/(components)/create-list-form';
import { DeleteListModal } from '../../(routes)/manage/(components)/delete-list-modal';
import { api, DEFAULT_RQ_OPTIONS, getRequestKey } from '../../api/api';
import { getManageListsReturnSchema } from '../../api/manage-lists/types';
import { ListCard } from '../(list-card)/list-card';

export function ManageListData(): JSX.Element {
  const { user } = useUser();

  const { data } = useQuery({
    ...DEFAULT_RQ_OPTIONS,
    enabled: !isNil(user?.id),
    async queryFn() {
      const response = await fetch(api.getManageLists());

      return getManageListsReturnSchema.parse(await response.json());
    },
    queryKey: getRequestKey(api.getManageLists()),
  });

  return (
    <>
      {isNil(user) ? null : <CreateListForm />}
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
