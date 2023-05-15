import { currentUser } from '@clerk/nextjs';
import { DateTime } from 'luxon';
import Link from 'next/link';
import type { JSX } from 'react';

import { prisma } from '../../../../prisma/database';
import { ListCard } from '../../../(components)/list-card';
import { EditModal } from './(components)/edit-modal';

type ListPageProperties = {
  params: {
    id: string;
  };
};

export default async function ListPage({
  params,
}: ListPageProperties): Promise<JSX.Element | null> {
  const user = await currentUser();

  const list = await prisma.learningList.findUnique({
    select: {
      createdAt: true,
      creator: {
        select: {
          clerkId: true,
          profileImageUrl: true,
          username: true,
        },
      },
      favoritedBy: {
        select: { id: true },
      },
      id: true,
      learningMaterials: {
        select: {
          id: true,
          instructors: true,
          links: {
            select: {
              id: true,
              url: true,
            },
          },
          name: true,
          publisherName: true,
        },
      },
      name: true,
      updatedAt: true,
    },
    where: {
      id: params.id,
    },
  });

  if (!list) {
    return null;
  }

  const isOwnedByCurrent = user?.id === list.creator.clerkId;

  return (
    <div className="mx-auto my-4 grid max-w-7xl place-items-center">
      {/* @ts-expect-error Component returns promise */}
      <ListCard
        creatorProfileImage={list.creator.profileImageUrl}
        creatorUsername={list.creator.username}
        listCreatedAt={DateTime.fromJSDate(list.createdAt).toRelative()}
        listId={list.id}
        listName={list.name}
        listUpdatedAt={DateTime.fromJSDate(list.updatedAt).toRelative()}
      />
      {list.learningMaterials.map(material => {
        const urlObjects = material.links.map(link => {
          const url = new URL(link.url);

          return {
            host: url.hostname,
            key: link.id,
            url: link.url,
          };
        });

        return (
          <div
            className="m-4 mx-auto flex w-full max-w-5xl justify-between border-2 p-4 shadow-sm"
            key={material.id}
          >
            <div>
              <p>
                <span className="text-lg font-bold">{material.name}</span> --{' '}
                {new Intl.ListFormat().format(material.instructors)}
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
            {isOwnedByCurrent && <EditModal />}
          </div>
        );
      })}
    </div>
  );
}
