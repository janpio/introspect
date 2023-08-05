'use client';
import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { isNil } from 'lodash';
import { Fragment, JSX } from 'react';

import { DEFAULT_RQ_OPTIONS } from '../../../actions/constants';
import { getManageLists } from '../../../actions/get-manage-lists/get-manage-lists';
import { getManageListsKeys } from '../../../actions/get-manage-lists/types';
import { CreateListForm } from '../../(routes)/manage/(components)/create-list-form';
import { DeleteListModal } from '../../(routes)/manage/(components)/delete-list-modal';
import { ListCard } from '../(list-card)/list-card';

export function ManageListData(): JSX.Element {
  const { user } = useUser();

  const { data } = useQuery({
    ...DEFAULT_RQ_OPTIONS,
    enabled: !isNil(user?.id),
    queryFn() {
      return getManageLists();
    },
    queryKey: getManageListsKeys,
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
