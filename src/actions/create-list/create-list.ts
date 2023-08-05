'use server';
import { currentUser } from '@clerk/nextjs';

import { prisma } from '../../prisma/database';
import { getIsAuthenticated } from '../../util/clerk';

type CreateListReturn = {
  id: string;
};

export async function createList(
  name: string,
): Promise<CreateListReturn | undefined> {
  const user = await currentUser();
  const isAuthenticated = await getIsAuthenticated();

  if (user === null || isAuthenticated === null) {
    return;
  }

  return prisma.learningList.create({
    data: {
      creator: {
        connect: {
          clerkId: user.id,
        },
      },
      name,
    },
    select: { id: true },
  });
}
