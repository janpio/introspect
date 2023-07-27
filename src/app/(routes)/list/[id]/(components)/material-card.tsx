import { useUser } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';
import { isNil } from 'lodash';
import Link from 'next/link';
import type { JSX } from 'react';
import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { twMerge } from 'tailwind-merge';

import { ROOT_URL } from '../../../../../util/constants';
import { zodFetch } from '../../../../../util/zod';
import { updateMaterialCompletionReturn } from '../../../../api/update-material-completion/types';
import { DeleteModal } from './delete-modal';
import { EditModal } from './edit-modal';

type MaterialCardProperties = {
  readonly findCard: (id: string) => { index: number };
  readonly isComplete: boolean;
  readonly isEditing: boolean;
  readonly isOwnedByCurrent: boolean;
  readonly listId: string;
  readonly listIndex: number;
  readonly material: {
    id: string;
    instructors: string[];
    links: Array<{ id: string; url: string }>;
    name: string;
    publisherName: string;
  };
  readonly moveCard: (id: string, to: number) => void;
  readonly order: number;
};

export function MaterialCard({
  findCard,
  isEditing,
  moveCard,
  order,
  isComplete,
  isOwnedByCurrent,
  listId,
  listIndex,
  material,
}: MaterialCardProperties): JSX.Element {
  const { user } = useUser();
  const [isDone, setIsDone] = useState(isComplete);

  const originalIndex = findCard(String(order)).index;

  const [{ isDragging }, drag] = useDrag(() => {
    return {
      collect(monitor): { isDragging: boolean } {
        return {
          isDragging: monitor.isDragging(),
        };
      },
      end(item, monitor): void {
        const { order, originalIndex } = item as {
          order: string;
          originalIndex: number;
        };
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveCard(order, originalIndex);
        }
      },
      item: { order: String(order), originalIndex },
      type: 'card',
    };
  });

  const [, drop] = useDrop(() => {
    return {
      accept: 'card',
      hover({ order: order_ }: { order: string }): void {
        if (order_ !== String(order)) {
          const { index } = findCard(String(order));
          moveCard(order_, index);
        }
      },
    };
  });

  const urlObjects = material.links.map(link => {
    const url = new URL(link.url);

    return {
      host: url.hostname,
      key: link.id,
      url: link.url,
    };
  });

  const { isLoading, mutate } = useMutation({
    async mutationFn(complete: boolean) {
      setIsDone(complete);
      if (!isNil(user)) {
        await zodFetch(
          updateMaterialCompletionReturn,
          `${ROOT_URL}/api/update-material-completion`,
          {
            body: JSON.stringify({
              clerkId: user.id,
              complete,
              materialId: material.id,
            }),
            credentials: 'same-origin',
            method: 'POST',
          },
        );
      }
    },
  });

  return (
    <div
      className={twMerge(
        'm-2 mx-auto flex w-full max-w-5xl justify-between gap-2 border-2 p-4 shadow-sm',
        isOwnedByCurrent && isEditing && 'cursor-move',
        isDragging && 'opacity-0',
      )}
      ref={(node): ReturnType<typeof drag> | undefined => {
        if (isOwnedByCurrent && isEditing) {
          return drag(drop(node));
        }
      }}
    >
      <div>
        <p>
          <span className="text-lg font-bold">{`#${listIndex + 1} ${
            material.name
          }`}</span>{' '}
          -- {new Intl.ListFormat().format(material.instructors)}
        </p>
        <p>{material.publisherName}</p>
        <div className="flex flex-wrap gap-2">
          {urlObjects.map(urlObject => {
            return (
              <p key={urlObject.key}>
                <Link
                  className="text-blue-700 underline"
                  href={urlObject.url}
                  referrerPolicy="no-referrer"
                  target="_blank"
                >
                  {urlObject.host}
                </Link>
              </p>
            );
          })}
        </div>
        <div className="my-4">
          {isOwnedByCurrent && isEditing && (
            <div className="flex flex-wrap gap-2">
              <EditModal
                listId={listId}
                userId={user?.id}
                material={{
                  ...material,
                  links: material.links.map(link => {
                    return link.url;
                  }),
                }}
              />
              <DeleteModal
                listId={listId}
                materialId={material.id}
                materialTitle={material.name}
                order={order}
              />
            </div>
          )}
        </div>
      </div>
      <div>
        {!isNil(user) && (
          <input
            aria-label="Mark material as complete"
            checked={isDone}
            disabled={isLoading}
            id={`done-${order}`}
            name={`done-${order}`}
            type="checkbox"
            value={String(isDone)}
            className={twMerge(
              'mb-4 h-6 w-6 rounded text-green-500',
              isLoading ? 'bg-gray-200 opacity-50' : 'cursor-pointer',
            )}
            onChange={(): void => {
              mutate(!isDone);
            }}
          />
        )}
      </div>
    </div>
  );
}
