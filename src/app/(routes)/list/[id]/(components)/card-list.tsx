'use client';
import type { JSX } from 'react';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import type { getListData } from '../data';
import { MaterialCard } from './material-card';

type CardListProperties = {
  isOwnedByCurrent: boolean;
  list: Awaited<ReturnType<typeof getListData>>['list'];
  user: {
    id?: string;
    profileImageUrl?: string;
    username?: string | null;
  } | null;
};

export function CardList({
  isOwnedByCurrent,
  list,
  user,
}: CardListProperties): JSX.Element {
  const [cards, setCards] = useState(list?.learningListMaterial ?? []);

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
    // @ts-expect-error it's fine
    setCards([...newCards.slice(0, atIndex), card, ...newCards.slice(atIndex)]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid w-full md:grid-cols-2 md:gap-2">
        {list &&
          cards.map(listMaterial => {
            const { learningMaterial, order } = listMaterial;
            return (
              <MaterialCard
                findCard={findCard}
                isComplete={learningMaterial.completedBy.length > 0}
                isOwnedByCurrent={isOwnedByCurrent}
                key={learningMaterial.id}
                listId={list.id}
                material={learningMaterial}
                moveCard={moveCard}
                order={order}
                user={{
                  id: user?.id,
                  profileImageUrl: user?.profileImageUrl,
                  username: user?.username,
                }}
              />
            );
          })}
      </div>
    </DndProvider>
  );
}
