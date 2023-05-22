'use server';
import { currentUser } from '@clerk/nextjs';

import { prisma } from '../../../../prisma/database';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getListData = async (listId: string) => {
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
          id: true,
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
          order: true,
        },
      },
      name: true,
      updatedAt: true,
    },
    where: {
      id: listId,
    },
  });

  return { list, user };
};
