import { StarIcon } from '@heroicons/react/24/solid';
import { DateTime } from 'luxon';
import Image from 'next/image';
import type { JSX } from 'react';

import { prisma } from '../../prisma/database';

// eslint-disable-next-line unicorn/numeric-separators-style
export const revalidate = 86400;

export default async function Hello(): Promise<JSX.Element> {
  const lists = await prisma.learningList.findMany({
    select: {
      createdAt: true,
      creator: {
        select: {
          profileImageUrl: true,
          username: true,
        },
      },
      id: true,
      name: true,
      updatedAt: true,
    },
  });

  return (
    <main className="my-auto">
      <h1 className="my-4 text-center text-3xl font-bold text-blue-900">
        Top Lists
      </h1>
      <div className="grid place-items-center">
        {lists.map(list => {
          return (
            <div
              className="flex w-full max-w-5xl justify-between border-2 p-4 shadow-sm"
              key={list.id}
            >
              <div className="grid">
                <p className="text-xl font-bold underline">{list.name}</p>
                <time>
                  Created:{' '}
                  {DateTime.fromISO(list.createdAt.toISOString()).toRelative()}
                </time>
                <time>
                  Updated:{' '}
                  {DateTime.fromISO(list.updatedAt.toISOString()).toRelative()}
                </time>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {list.creator.profileImageUrl && (
                    <Image
                      alt={`${list.creator.username ?? ''} profile`}
                      className="rounded-full"
                      height={60}
                      src={list.creator.profileImageUrl}
                      width={60}
                    />
                  )}
                  <p>{list.creator.username}</p>
                </div>
                <button type="button">
                  <StarIcon className="h-14 w-14 text-gray-400" />
                  <div className="text-center">(0)</div>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
