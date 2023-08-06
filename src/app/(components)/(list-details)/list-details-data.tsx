'use client';
import { useUser } from '@clerk/nextjs';
import { useToggle } from '@ethang/hooks/use-toggle';
import { useMutation, useQuery } from '@tanstack/react-query';
import { isNil } from 'lodash';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { CreateModal } from '../../(routes)/list/[id]/(components)/create-modal';
import { MaterialCard } from '../../(routes)/list/[id]/(components)/material-card';
import { api, DEFAULT_RQ_OPTIONS, getRequestKey } from '../../api/api';
import {
  LearningListMaterialsFromQuery,
  learningListReturnSchema,
} from '../../api/learning-list/types';
import { Button } from '../(elements)/button';
import { Toggle } from '../(elements)/toggle';
import { LoadingIcon } from '../loading-icon';

type CardListProperties = {
  readonly listId: string;
};

export function ListDetailsData({
  listId,
}: CardListProperties): JSX.Element | null {
  const { user } = useUser();
  const [isEditing, toggleEditing] = useToggle(false);
  const [cards, setCards] = useState<LearningListMaterialsFromQuery>([]);

  const { data } = useQuery({
    ...DEFAULT_RQ_OPTIONS,
    async queryFn() {
      const data = await fetch(api.getList(listId));

      return learningListReturnSchema.parse(await data.json());
    },
    queryKey: getRequestKey(api.getList(listId)),
  });

  const { isLoading: isMutationLoading, mutate } = useMutation({
    async mutationFn() {
      if (!isNil(data)) {
        await fetch(api.updateListOrder(listId, cards));
      }
    },
  });

  useEffect(() => {
    setCards(data?.learningListMaterial ?? []);
  }, [cards, data?.learningListMaterial]);

  const isOwnedByCurrent = user?.id === data?.creator.clerkId;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const findCard = (order: string) => {
    const card = cards.find(item => {
      return String(item.order) === order;
    });

    return { card, index: card ? cards.indexOf(card) : 0 };
  };

  const moveCard = (order: string, atIndex: number): void => {
    const { card, index } = findCard(order);
    const newCards = [...cards.slice(0, index), ...cards.slice(index + 1)];

    setCards(
      card
        ? [...newCards.slice(0, atIndex), card, ...newCards.slice(atIndex)]
        : [...newCards.slice(0, atIndex), ...newCards.slice(atIndex)],
    );
  };

  if (isNil(data)) {
    return <LoadingIcon count={5} />;
  }

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        {isOwnedByCurrent && (
          <Toggle
            isChecked={isEditing}
            label="Edit Mode"
            toggleChecked={(): void => {
              toggleEditing();
            }}
          />
        )}
        {isOwnedByCurrent && isEditing && (
          <Button
            className="my-2"
            disabled={isMutationLoading}
            onClick={(): void => {
              return mutate();
            }}
          >
            Save List Order
          </Button>
        )}
        <div className="grid w-full md:grid-cols-2 md:gap-2">
          {cards.map((listMaterial, index) => {
            const { learningMaterial, order } = listMaterial;

            return (
              <MaterialCard
                findCard={findCard}
                isEditing={isEditing}
                isOwnedByCurrent={isOwnedByCurrent}
                key={learningMaterial.id}
                listId={listId}
                listIndex={index}
                material={learningMaterial}
                moveCard={moveCard}
                order={order}
                isComplete={
                  learningMaterial.completedBy !== undefined &&
                  learningMaterial.completedBy.length > 0
                }
              />
            );
          })}
        </div>
      </DndProvider>
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
