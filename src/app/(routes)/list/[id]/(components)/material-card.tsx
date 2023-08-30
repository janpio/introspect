import { useUser } from '@clerk/nextjs';
import type { UseMutateFunction } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { isNil } from 'lodash';
import Link from 'next/link';
import type { JSX } from 'react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Button } from '../../../../(components)/(elements)/button';
import { queryClient } from '../../../../(components)/providers';
import { api, getRequestKey } from '../../../../api/api';
import { DeleteModal } from './delete-modal';
import { EditModal } from './edit-modal';

type MaterialCardProperties = {
  readonly isComplete: boolean;
  readonly isEditing: boolean;
  readonly isOwnedByCurrent: boolean;
  readonly isUpdateOrderLoading: boolean;
  readonly listId: string;
  readonly listIndex: number;
  readonly listLength: number;
  readonly material: {
    id: string;
    instructors: string[];
    links: Array<{ id: string; url: string }>;
    name: string;
    publisherName: string;
  };
  readonly order: number;
  readonly updateOrder: UseMutateFunction<
    void,
    unknown,
    { currentOrder: number; direction: 'up' | 'down' },
    unknown
  >;
};

export function MaterialCard({
  isEditing,
  order,
  isComplete,
  isOwnedByCurrent,
  isUpdateOrderLoading,
  listId,
  listIndex,
  listLength,
  material,
  updateOrder,
}: MaterialCardProperties): JSX.Element {
  const { user } = useUser();
  const [isDone, setIsDone] = useState(isComplete);

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
        await fetch(api.updateMaterialCompletion(material.id, complete));

        await queryClient.invalidateQueries(getRequestKey(api.getList(listId)));
      }
    },
  });

  return (
    <div
      className={twMerge(
        'mx-auto my-2 flex w-full max-w-5xl justify-between gap-2 border-2 p-4 shadow-sm',
      )}
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
              {order !== 0 && (
                <Button
                  disabled={isLoading || isUpdateOrderLoading}
                  onClick={(): void => {
                    updateOrder({ currentOrder: order, direction: 'down' });
                  }}
                >
                  {'<-'}
                </Button>
              )}
              {order !== listLength - 1 && (
                <Button
                  disabled={isLoading || isUpdateOrderLoading}
                  onClick={(): void => {
                    updateOrder({ currentOrder: order, direction: 'up' });
                  }}
                >
                  {'->'}
                </Button>
              )}
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
              isLoading || isUpdateOrderLoading
                ? 'bg-gray-200 opacity-50'
                : 'cursor-pointer',
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
