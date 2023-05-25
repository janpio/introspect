import type { PrismaPromise } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { learningListTags } from '../learning-list/types';
import { updateListOrderBodySchema } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
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
  revalidateTag(learningListTags(body.listId)[0]);

  return NextResponse.json(data);
}
