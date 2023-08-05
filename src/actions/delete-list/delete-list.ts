'use server';

import { currentUser } from '@clerk/nextjs';

import { prisma } from '../../prisma/database';
import { getIsAuthenticated } from '../../util/clerk';

type DeleteListReturn = {
  id: string;
};

export async function deleteList(
  listId: string,
): Promise<DeleteListReturn | undefined> {
  const user = await currentUser();
  const isAuthenticated = await getIsAuthenticated();

  if (user === null || isAuthenticated === null) {
    return;
  }

  const results = await prisma.$transaction([
    prisma.learningListMaterial.deleteMany({
      where: {
        learningListId: listId,
      },
    }),
    prisma.learningList.update({
      data: {
        favoritedBy: {
          set: undefined,
        },
      },
      where: {
        creator: {
          clerkId: user.id,
        },
        id: listId,
      },
    }),
    prisma.learningList.delete({
      select: { id: true },
      where: {
        creator: {
          clerkId: user.id,
        },
        id: listId,
      },
    }),
  ]);

  return results[2];
}
