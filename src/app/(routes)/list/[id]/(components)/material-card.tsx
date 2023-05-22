import classNames from 'classnames';
import Link from 'next/link';
import type { ChangeEvent, JSX } from 'react';
import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { updateMaterialCompletion } from '../../../../(actions)/update-material-completion';
import { DeleteModal } from './delete-modal';
import { EditModal } from './edit-modal';

type MaterialCardProperties = {
  findCard: (id: string) => { index: number };
  isComplete: boolean;
  isOwnedByCurrent: boolean;
  listId: string;
  listIndex: number;
  material: {
    id: string;
    instructors: string[];
    links: Array<{ id: string; url: string }>;
    name: string;
    publisherName: string;
  };
  moveCard: (id: string, to: number) => void;
  order: number;
  user: {
    id?: string;
    profileImageUrl?: string;
    username?: string | null;
  } | null;
};

export function MaterialCard({
  findCard,
  moveCard,
  order,
  isComplete,
  isOwnedByCurrent,
  listId,
  listIndex,
  material,
  user,
}: MaterialCardProperties): JSX.Element {
  const [isDone, setIsDone] = useState(isComplete);
  const [canUpdate, setCanUpdate] = useState(true);

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

  const handleMarkAsDone = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    setIsDone(Boolean(event.target.checked));
    setCanUpdate(false);
    if (user?.id) {
      await updateMaterialCompletion({
        clerkId: user.id,
        complete: Boolean(event.target.checked),
        materialId: material.id,
      });
    }

    setCanUpdate(true);
  };

  return (
    <div
      className={classNames(
        'm-2 mx-auto flex w-full max-w-5xl justify-between gap-2 border-2 p-4 shadow-sm',
        {
          'cursor-move': isOwnedByCurrent,
          'opacity-0': isDragging,
        },
      )}
      ref={(node): ReturnType<typeof drag> | undefined => {
        if (isOwnedByCurrent) {
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
          {isOwnedByCurrent && (
            <div className="flex flex-wrap gap-2">
              <EditModal
                material={{
                  ...material,
                  links: material.links.map(link => {
                    return link.url;
                  }),
                }}
                user={{
                  id: user?.id,
                  profileImageUrl: user?.profileImageUrl,
                  username: user?.username,
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
        {user?.id && (
          <input
            aria-label="Mark material as complete"
            checked={isDone}
            disabled={!canUpdate}
            id={`done-${order}`}
            name={`done-${order}`}
            type="checkbox"
            value={String(isDone)}
            className={classNames('mb-4 h-6 w-6 rounded text-green-500', {
              'bg-gray-200 opacity-50': !canUpdate,
              'cursor-pointer': canUpdate,
            })}
            onChange={handleMarkAsDone}
          />
        )}
      </div>
    </div>
  );
}
