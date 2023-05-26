import { isNil } from 'lodash';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const clerkId = request.nextUrl.searchParams.get('clerkId');
  const listId = request.nextUrl.searchParams.get('listId');

  if (isNil(listId)) {
    return NextResponse.json({ error: 'Invalid parameters.' });
  }

  const getCompletedBy = isNil(clerkId)
    ? false
    : {
        select: { id: true },
        where: {
          clerkId,
        },
      };

  const result = await prisma.learningList.findUnique({
    select: {
      createdAt: true,
      creator: {
        select: {
          clerkId: true,
          profileImageUrl: true,
          username: true,
        },
      },
      id: true,
      learningListMaterial: {
        orderBy: {
          order: 'asc',
        },
        select: {
          id: true,
          learningMaterial: {
            select: {
              completedBy: getCompletedBy,
              id: true,
              instructors: true,
              links: { select: { id: true, url: true } },
              name: true,
              publisherName: true,
            },
          },
          order: true,
        },
      },
      name: true,
      updatedAt: true,
    },
    where: {
      id: listId,
    },
  });

  return NextResponse.json(result);
}
