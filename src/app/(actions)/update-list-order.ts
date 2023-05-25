'use server';
import type { PrismaPromise } from '@prisma/client';

import { prisma } from '../../prisma/database';

type UpdateListOrderData = {
  list: Array<{
    id: string;
  }>;
  listId: string;
};

export const updateListOrder = async ({
  list,
  listId,
}: UpdateListOrderData): Promise<Array<{ id: string }>> => {
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
};
