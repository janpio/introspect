import type { PrismaPromise } from '@prisma/client';
import { isNil } from 'lodash';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const clerkId = request.nextUrl.searchParams.get('clerkId');
  const listId = request.nextUrl.searchParams.get('listId');

  if (isNil(listId)) {
    return NextResponse.json({ error: 'Invalid parameters' });
  }

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

  if (!isNil(clerkId)) {
    promises = [
      ...promises,
      prisma.person.findUnique({
        select: {
          favoriteLists: {
            select: { id: true },
            where: { id: listId },
          },
        },
        where: { clerkId },
      }),
    ];
  }

  const body = await prisma.$transaction(promises);

  return NextResponse.json(body);
}
