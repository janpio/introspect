'use client';
import type { CSSProperties, JSX } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const style: CSSProperties = {
  backgroundColor: 'white',
  border: '1px dashed gray',
  cursor: 'move',
  marginBottom: '.5rem',
  padding: '0.5rem 1rem',
};

export type CardProperties = {
  findCard: (id: string) => { index: number };
  id: string;
  moveCard: (id: string, to: number) => void;
  text: string;
};

type Item = {
  id: string;
  originalIndex: number;
};

export function Card({
  id,
  text,
  moveCard,
  findCard,
}: CardProperties): JSX.Element {
  const originalIndex = findCard(id).index;
  const [{ isDragging }, drag] = useDrag(() => {
    return {
      collect(monitor): { isDragging: boolean } {
        return {
          isDragging: monitor.isDragging(),
        };
      },
      end(item, monitor): void {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveCard(droppedId, originalIndex);
        }
      },
      item: { id, originalIndex },
      type: 'card',
    };
  }, [id, originalIndex, moveCard]);

  const [, drop] = useDrop(() => {
    return {
      accept: 'card',
      hover({ id: draggedId }: Item): void {
        if (draggedId !== id) {
          const { index: overIndex } = findCard(id);
          moveCard(draggedId, overIndex);
        }
      },
    };
  }, [findCard, moveCard]);

  const opacity = isDragging ? 0 : 1;
  return (
    <div
      style={{ ...style, opacity }}
      ref={(node): ReturnType<typeof drag> => {
        return drag(drop(node));
      }}
    >
      {text}
    </div>
  );
}
