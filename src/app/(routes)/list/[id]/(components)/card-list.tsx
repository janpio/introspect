'use client';
import { useToggle } from '@ethang/hooks/use-toggle';
import { isNil } from 'lodash';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { ROOT_URL } from '../../../../../util/constants';
import { zodFetch } from '../../../../../util/zod';
import { Button } from '../../../../(components)/(elements)/button';
import { Toggle } from '../../../../(components)/(elements)/toggle';
import { updateListOrderReturnSchema } from '../../../../api/update-list-order/types';
import type { getListData } from '../data';
import { CreateModal } from './create-modal';
import { MaterialCard } from './material-card';

type CardListProperties = {
  isOwnedByCurrent: boolean;
  list: Awaited<ReturnType<typeof getListData>>['data'];
  user: {
    id?: string;
    imageUrl?: string;
    username?: string | null;
  } | null;
};

export function CardList({
  isOwnedByCurrent,
  list,
  user,
}: CardListProperties): JSX.Element | null {
  const [isEditing, toggleEditing] = useToggle(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, toggleLoading] = useToggle(false);
  const [cards, setCards] = useState(list?.learningListMaterial ?? []);

  useEffect(() => {
    if (list?.learningListMaterial) {
      setCards(list.learningListMaterial);
    }
  }, [list]);

  if (isNil(list)) {
    return null;
  }

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
    setIsDisabled(false);
  };

  const handleUpdateListOrder = async (): Promise<void> => {
    toggleLoading();
    if (list.id) {
      await zodFetch(
        updateListOrderReturnSchema,
        `${ROOT_URL}/api/update-list-order`,
        {
          body: JSON.stringify({
            list: cards,
            listId: list.id,
          }),
          credentials: 'same-origin',
          method: 'POST',
        },
      );
      setIsDisabled(true);
    }

    toggleLoading();
  };

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
            disabled={isDisabled || isLoading}
            onClick={handleUpdateListOrder}
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
                listId={list.id}
                listIndex={index}
                material={learningMaterial}
                moveCard={moveCard}
                order={order}
                isComplete={
                  learningMaterial.completedBy?.length === undefined ||
                  learningMaterial.completedBy.length > 0
                }
                user={{
                  id: user?.id,
                  profileImageUrl: user?.imageUrl,
                  username: user?.username,
                }}
              />
            );
          })}
        </div>
      </DndProvider>
      <div className="mx-auto my-4 max-w-5xl">
        {isOwnedByCurrent && isEditing && (
          <CreateModal
            listId={list.id}
            listLength={list.learningListMaterial.length}
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
