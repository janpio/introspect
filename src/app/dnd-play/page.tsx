'use client';
import type { JSX } from 'react';
import { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Card } from './(components)/card';

const defaultColumns = [
  {
    id: 0,
    text: 'Zero',
  },
  {
    id: 1,
    text: 'One',
  },
  {
    id: 2,
    text: 'Two',
  },
  {
    id: 3,
    text: 'Three',
  },
  {
    id: 4,
    text: 'Four',
  },
  {
    id: 5,
    text: 'Five',
  },
];

export default function DndPlay(): JSX.Element {
  const [columns, setColumns] = useState(defaultColumns);

  const findCard = useCallback(
    (id: string) => {
      const card = columns.find(c => {
        return `${c.id}` === id;
      }) as {
        id: number;
        text: string;
      };
      return {
        card,
        index: columns.indexOf(card),
      };
    },
    [columns],
  );

  const moveCard = useCallback(
    (id: string, atIndex: number) => {
      const { card, index } = findCard(id);
      const newCards = [
        ...columns.slice(0, index),
        ...columns.slice(index + 1),
      ];
      setColumns([
        ...newCards.slice(0, atIndex),
        card,
        ...newCards.slice(atIndex),
      ]);
    },
    [columns, findCard],
  );

  return (
    <main>
      <DndProvider backend={HTML5Backend}>
        <div className="m-2 grid grid-cols-2 gap-2">
          {columns.map(column => {
            return (
              <Card
                findCard={findCard}
                id={`${column.id}`}
                key={column.id}
                moveCard={moveCard}
                text={column.text}
              />
            );
          })}
        </div>
      </DndProvider>
    </main>
  );
}
