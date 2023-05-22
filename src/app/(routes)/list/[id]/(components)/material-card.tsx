'use client';
import classNames from 'classnames';
import Link from 'next/link';
import type { ChangeEvent, JSX } from 'react';
import { useState } from 'react';

import { updateMaterialCompletion } from '../../../../(actions)/update-material-completion';
import { EditModal } from './edit-modal';

type MaterialCardProperties = {
  index: number;
  isComplete: boolean;
  isOwnedByCurrent: boolean;
  material: {
    id: string;
    instructors: string[];
    links: Array<{ id: string; url: string }>;
    name: string;
    publisherName: string;
  };
  user: {
    id?: string;
    profileImageUrl?: string;
    username?: string | null;
  } | null;
};

export function MaterialCard({
  index,
  isComplete,
  isOwnedByCurrent,
  material,
  user,
}: MaterialCardProperties): JSX.Element {
  const [isDone, setIsDone] = useState(isComplete);
  const [canUpdate, setCanUpdate] = useState(true);

  const urlObjects = material.links.map(link => {
    const url = new URL(link.url);

    return {
      host: url.hostname,
      key: link.id,
      url: link.url,
    };
  });

  const handleDoneChange = async (
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

    setTimeout(() => {
      setCanUpdate(true);
    }, 2000);
  };

  return (
    <div className="m-2 mx-auto flex w-full max-w-5xl justify-between gap-2 border-2 p-4 shadow-sm">
      <div>
        <p>
          <span className="text-lg font-bold">{`#${index + 1} ${
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
      </div>
      <div>
        {user && (
          <input
            aria-label="Mark material as complete"
            checked={isDone}
            disabled={!canUpdate}
            id={`done-${index}`}
            name={`done-${index}`}
            type="checkbox"
            value={String(isDone)}
            className={classNames('mb-4 h-6 w-6 rounded text-green-500', {
              'bg-gray-200 opacity-50': !canUpdate,
              'cursor-pointer': canUpdate,
            })}
            onChange={handleDoneChange}
          />
        )}
        {isOwnedByCurrent && (
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
        )}
      </div>
    </div>
  );
}
