import { constants } from 'node:http2';

import { currentUser } from '@clerk/nextjs';
import type { PrismaPromise } from '@prisma/client';
import { isNil } from 'lodash';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const user = await currentUser();
  const listId = request.nextUrl.searchParams.get('listId');

  if (listId === null) {
    return NextResponse.json(
      { error: 'Invalid params' },
      {
        status: constants.HTTP_STATUS_BAD_REQUEST,
      },
    );
  }

  const userId = user?.id ?? request.nextUrl.searchParams.get('userId');

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

  if (!isNil(userId)) {
    promises = [
      ...promises,
      prisma.person.findUnique({
        select: {
          favoriteLists: {
            select: { id: true },
            where: { id: listId },
          },
        },
        where: { clerkId: userId },
      }),
    ];
  }

  const data = await prisma.$transaction(promises);

  return NextResponse.json(data);
}
