import { constants } from 'node:http2';

import { currentUser } from '@clerk/nextjs';
import { PrismaPromise } from '@prisma/client';
import { isNil } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

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

  const data = await prisma.$transaction(promises);

  return NextResponse.json(data);
}
