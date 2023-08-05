'use server';
import { currentUser } from '@clerk/nextjs';

import { prisma } from '../../prisma/database';
import { getIsAuthenticated } from '../../util/clerk';

type FavoriteListReturn = {
  id: string;
};

export async function favoriteList(
  listId: string,
  isAdding: boolean,
): Promise<FavoriteListReturn | undefined> {
  const user = await currentUser();
  const isAuthenticated = await getIsAuthenticated();

  if (user === null || isAuthenticated === null) {
    return;
  }

  return prisma.learningList.update({
    data: {
      favoritedBy: isAdding
        ? { connect: { clerkId: user.id } }
        : { disconnect: { clerkId: user.id } },
    },
    select: { id: true },
    where: {
      id: listId,
    },
  });
}
