import { constants } from 'node:http2';

import type { PrismaPromise } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { isAuthenticated } from '../../../util/clerk';
import { updateListOrderBodySchema } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  if ((await isAuthenticated()) === null) {
    return NextResponse.json(
      { error: 'Unauthenticated' },
      { status: constants.HTTP_STATUS_UNAUTHORIZED },
    );
  }

  const body = updateListOrderBodySchema.parse(await request.json());

  let promises: Array<PrismaPromise<{ id: string }>> = [];
  let newOrder = 0;

  for (const item of body.list) {
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
        id: body.listId,
      },
    }),
  ];

  const data = await Promise.all(promises);

  return NextResponse.json(data);
}
