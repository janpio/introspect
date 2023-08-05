'use server';

import { prisma } from '../../prisma/database';

type GetListPageReturn = Array<{
  id: string;
}>;

export async function getListPage(): Promise<GetListPageReturn> {
  return prisma.learningList.findMany({
    orderBy: {
      favoritedBy: {
        _count: 'desc',
      },
    },
    select: {
      id: true,
    },
  });
}
