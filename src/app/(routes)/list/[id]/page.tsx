import { currentUser } from '@clerk/nextjs';
import { DateTime } from 'luxon';
import Link from 'next/link';
import type { JSX } from 'react';

import { prisma } from '../../../../prisma/database';
import { ListCard } from '../../../(components)/list-card';
import { CreateModal } from './(components)/create-modal';
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
      learningListMaterial: {
        orderBy: { order: 'asc' },
        select: {
          learningMaterial: {
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
      <div className="grid w-full md:grid-cols-2 md:gap-2">
        {list.learningListMaterial.map((listMaterial, index) => {
          const { learningMaterial: material } = listMaterial;
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
              className="m-2 mx-auto flex w-full max-w-5xl justify-between border-2 p-4 shadow-sm"
              key={material.id}
            >
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
              {isOwnedByCurrent && (
                <EditModal
                  material={{
                    ...material,
                    links: material.links.map(link => {
                      return link.url;
                    }),
                  }}
                  user={{
                    id: user.id,
                    profileImageUrl: user.profileImageUrl,
                    username: user.username,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mx-auto my-4 max-w-5xl">
        {isOwnedByCurrent && (
          <CreateModal
            listId={list.id}
            listLength={list.learningListMaterial.length}
            user={{
              id: user.id,
              profileImageUrl: user.profileImageUrl,
              username: user.username,
            }}
          />
        )}
      </div>
    </div>
  );
}
