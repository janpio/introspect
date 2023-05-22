'use server';
import type { PrismaPromise } from '@prisma/client';

import { prisma } from '../../prisma/database';
import type { CardListArray } from '../(routes)/list/[id]/util';

type UpdateListOrderData = {
  list: CardListArray;
};

export const updateListOrder = async ({
  list,
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

  return Promise.all(promises);
};
