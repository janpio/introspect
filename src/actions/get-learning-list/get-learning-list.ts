'use server';

import { currentUser } from '@clerk/nextjs';
import { isNil } from 'lodash';
import { z } from 'zod';

import { prisma } from '../../prisma/database';
import { learningListReturnSchema } from './types';

export async function getLearningList(
  listId: string,
): Promise<z.output<typeof learningListReturnSchema>> {
  const user = await currentUser();

  const getCompletedBy = isNil(user?.id)
    ? false
    : {
        select: { id: true },
        where: {
          clerkId: user?.id,
        },
      };

  // @ts-expect-error Dates will be serialized to string
  return prisma.learningList.findUnique({
    select: {
      createdAt: true,
      creator: {
        select: {
          clerkId: true,
          profileImageUrl: true,
          username: true,
        },
      },
      id: true,
      learningListMaterial: {
        orderBy: {
          order: 'asc',
        },
        select: {
          id: true,
          learningMaterial: {
            select: {
              completedBy: getCompletedBy,
              id: true,
              instructors: true,
              links: { select: { id: true, url: true } },
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
}
