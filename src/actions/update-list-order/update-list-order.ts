'use server';
import type { PrismaPromise } from '@prisma/client';

import { prisma } from '../../prisma/database';
import { getIsAuthenticated } from '../../util/clerk';

type UpdateListOrder = {
  list: Array<{ id: string }>;
  listId: string;
};

type UpdateListOrderReturn = Array<{
  id: string;
}>;

export async function updateListOrder({
  listId,
  list,
}: UpdateListOrder): Promise<UpdateListOrderReturn | undefined> {
  const isAuthenticated = await getIsAuthenticated();

  if (isAuthenticated === null) {
    return;
  }

  let promises: Array<PrismaPromise<{ id: string }>> = [];
  let newOrder = 0;

  for (const item of list) {
    promises = [
      ...promises,
      prisma.learningListMaterial.update({
        data: {
          order: newOrder,
        },
        select: { id: true },
        where: {
          id: item.id,
        },
      }),
    ];
    newOrder += 1;
  }

  promises = [
    ...promises,
    prisma.learningList.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: listId,
      },
    }),
  ];

  return Promise.all(promises);
}
