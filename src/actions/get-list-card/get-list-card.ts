'use server';

import { currentUser } from '@clerk/nextjs';
import { PrismaPromise } from '@prisma/client';
import { isNil } from 'lodash';

import { prisma } from '../../prisma/database';

type GetListCardReturn = [
  (
    | {
        _count: {
          favoritedBy: number;
        };
      }
    | undefined
  ),
  {
    favoriteLists?: Array<{ id: string }>;
  },
];

export async function getListCard(listId: string): Promise<GetListCardReturn> {
  const user = await currentUser();

  let promises: Array<PrismaPromise<unknown>> = [
    prisma.learningList.findUnique({
      select: {
        _count: {
          select: {
            favoritedBy: true,
          },
        },
      },
      where: {
        id: listId,
      },
    }),
  ];

  if (!isNil(user?.id)) {
    promises = [
      ...promises,
      prisma.person.findUnique({
        select: {
          favoriteLists: {
            select: { id: true },
            where: { id: listId },
          },
        },
        where: { clerkId: user?.id },
      }),
    ];
  }

  // @ts-expect-error use manual typing
  return prisma.$transaction(promises);
}
