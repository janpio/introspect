import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { learningListParametersSchema } from './types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { clerkId, isLoggedIn, listId } = learningListParametersSchema.parse(
    Object.fromEntries(request.nextUrl.searchParams),
  );

  const getCompletedBy = isLoggedIn
    ? {
        select: { id: true },
        where: {
          clerkId,
        },
      }
    : false;

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
