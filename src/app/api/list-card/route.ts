import type { PrismaPromise } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestBody = Object.fromEntries(request.nextUrl.searchParams) as {
    clerkId: string | undefined;
    listId: string;
  };

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
        id: requestBody.listId,
      },
    }),
  ];

  if (typeof requestBody.clerkId === 'string') {
    promises = [
      ...promises,
      prisma.person.findUnique({
        select: {
          favoriteLists: {
            select: { id: true },
            where: { id: requestBody.listId },
          },
        },
        where: { clerkId: requestBody.clerkId },
      }),
    ];
  }

  const body = await prisma.$transaction(promises);

  return NextResponse.json(body);
}
