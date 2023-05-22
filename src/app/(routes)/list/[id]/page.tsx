import { currentUser } from '@clerk/nextjs';
import { DateTime } from 'luxon';
import type { JSX } from 'react';

import { prisma } from '../../../../prisma/database';
import { ListCard } from '../../../(components)/list-card';
import { CreateModal } from './(components)/create-modal';
import { MaterialCard } from './(components)/material-card';

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
              completedBy: {
                select: { id: true },
                where: {
                  clerkId: user?.id,
                },
              },
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
          const { learningMaterial } = listMaterial;
          return (
            <MaterialCard
              index={index}
              isComplete={learningMaterial.completedBy.length > 0}
              isOwnedByCurrent={isOwnedByCurrent}
              key={learningMaterial.id}
              material={learningMaterial}
              user={{
                id: user?.id,
                profileImageUrl: user?.profileImageUrl,
                username: user?.username,
              }}
            />
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
