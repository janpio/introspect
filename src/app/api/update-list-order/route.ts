import { constants } from 'node:http2';

import { PrismaPromise } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { getIsAuthenticated } from '../../../util/clerk';
import { updateListOrderBodySchema } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const isAuthenticated = await getIsAuthenticated();

  if (isAuthenticated === null) {
    return NextResponse.json(
      { error: 'Unauthenticated' },
      {
        status: constants.HTTP_STATUS_UNAUTHORIZED,
      },
    );
  }

  const { listId, list } = updateListOrderBodySchema.parse(
    await request.json(),
  );

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

  promises = [
    ...promises,
    prisma.learningList.update({
      data: {
        updatedAt: new Date(),
      },
      where: {
        id: listId,
      },
    }),
  ];

  const data = Promise.all(promises);

  return NextResponse.json(data);
}
