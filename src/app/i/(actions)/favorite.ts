'use server';

import { isNil } from 'lodash';

import { prisma } from '../../../prisma/database';

export async function favoriteList(
  clerkId: string,
  listId: string,
  hasFavorited: boolean,
): Promise<{ id: string } | null> {
  const action = hasFavorited
    ? {
        disconnect: {
          id: listId,
        },
      }
    : {
        connect: {
          id: listId,
        },
      };

  const nonUpdated = await prisma.person.findUnique({
    select: { id: true },
    where: { clerkId },
  });

  if (!isNil(nonUpdated)) {
    return prisma.person
      .update({
        data: {
          favoriteLists: action,
        },
        select: { id: true },
        where: {
          id: nonUpdated.id,
        },
      })
      .catch(() => {
        return null;
      });
  }

  return null;
}
