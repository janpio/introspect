'use client';
import { useUser } from '@clerk/nextjs';
import { useToggle } from '@ethang/hooks/use-toggle';
import { useMutation, useQuery } from '@tanstack/react-query';
import { isNil } from 'lodash';
import type { JSX } from 'react';

import { CreateModal } from '../../(routes)/list/[id]/(components)/create-modal';
import { MaterialCard } from '../../(routes)/list/[id]/(components)/material-card';
import { api, DEFAULT_RQ_OPTIONS, getRequestKey } from '../../api/api';
import { learningListReturnSchema } from '../../api/learning-list/types';
import { Toggle } from '../(elements)/toggle';
import { LoadingIcon } from '../loading-icon';
import { queryClient } from '../providers';

type CardListProperties = {
  readonly listId: string;
};

export function ListDetailsData({
  listId,
}: CardListProperties): JSX.Element | null {
  const { user } = useUser();
  const [isEditing, toggleEditing] = useToggle(false);

  const { data } = useQuery({
    ...DEFAULT_RQ_OPTIONS,
    async queryFn() {
      const data = await fetch(api.getList(listId));

      return learningListReturnSchema.parse(await data.json());
    },
    queryKey: getRequestKey(api.getList(listId)),
  });

  const { mutate: updateOrder, isLoading: isUpdateOrderLoading } = useMutation({
    async mutationFn({
      currentOrder,
      direction,
    }: {
      currentOrder: number;
      direction: 'up' | 'down';
    }): Promise<void> {
      const itemA = data?.learningListMaterial.find(item => {
        return item.order === currentOrder;
      });
      const itemB = data?.learningListMaterial.find(item => {
        const findOrder =
          direction === 'up' ? currentOrder + 1 : currentOrder - 1;
        return item.order === findOrder;
      });

      if (itemA === undefined || itemB === undefined) {
        return;
      }

      await fetch(
        api.updateListOrder({
          listId,
          materialACurrentOrder: itemA.order,
          materialAId: itemA.learningMaterial.id,
          materialBCurrentOrder: itemB.order,
          materialBId: itemB.learningMaterial.id,
        }),
      );

      await queryClient.invalidateQueries(getRequestKey(api.getList(listId)));
    },
  });

  const isOwnedByCurrent = user?.id === data?.creator.clerkId;

  if (isNil(data)) {
    return <LoadingIcon count={5} />;
  }

  return (
    <>
      <div>
        {isOwnedByCurrent && (
          <Toggle
            isChecked={isEditing}
            label="Edit Mode"
            toggleChecked={(): void => {
              toggleEditing();
            }}
          />
        )}
        <div className="grid w-full md:grid-cols-2 md:gap-2">
          {data.learningListMaterial.map((listMaterial, index) => {
            const { learningMaterial, order } = listMaterial;

            return (
              <MaterialCard
                isEditing={isEditing}
                isOwnedByCurrent={isOwnedByCurrent}
                isUpdateOrderLoading={isUpdateOrderLoading}
                key={learningMaterial.id}
                listId={listId}
                listIndex={index}
                listLength={data.learningListMaterial.length}
                material={learningMaterial}
                order={order}
                updateOrder={updateOrder}
                isComplete={
                  learningMaterial.completedBy !== undefined &&
                  learningMaterial.completedBy.length > 0
                }
              />
            );
          })}
        </div>
      </div>
      <div className="mx-auto my-4 max-w-5xl">
        {isOwnedByCurrent && isEditing && (
          <CreateModal
            listId={listId}
            listLength={data?.learningListMaterial.length ?? 0}
            user={{
              id: user?.id,
              profileImageUrl: user?.imageUrl,
              username: user?.username,
            }}
          />
        )}
      </div>
    </>
  );
}
