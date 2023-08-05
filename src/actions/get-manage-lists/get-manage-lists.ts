'use server';

import { currentUser } from '@clerk/nextjs';

import { prisma } from '../../prisma/database';

type GetManageListsReturn = Array<{
  id: string;
  name: string;
}>;

export async function getManageLists(): Promise<
  GetManageListsReturn | undefined
> {
  const user = await currentUser();

  if (user === null) {
    return;
  }

  return prisma.learningList.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      creator: {
        clerkId: user?.id,
      },
    },
  });
}
