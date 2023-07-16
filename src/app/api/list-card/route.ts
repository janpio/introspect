import { currentUser } from '@clerk/nextjs';
import type { PrismaPromise } from '@prisma/client';
import { isNil } from 'lodash';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const user = await currentUser();
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

  const body = await prisma.$transaction(promises);

  return NextResponse.json(body);
}
