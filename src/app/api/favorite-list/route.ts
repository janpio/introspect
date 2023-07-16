import { constants } from 'node:http2';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { isAuthenticated } from '../../../util/clerk';
import type { FavoriteListReturn } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  if ((await isAuthenticated()) === null) {
    return NextResponse.json(
      { error: 'Unauthenticated' },
      { status: constants.HTTP_STATUS_UNAUTHORIZED },
    );
  }

  const { clerkId, listId, isAdding } = (await request.json()) as {
    clerkId: string;
    isAdding: boolean;
    listId: string;
  };

  const data: FavoriteListReturn = await prisma.learningList.update({
    data: {
      favoritedBy: isAdding
        ? { connect: { clerkId } }
        : { disconnect: { clerkId } },
    },
    select: { id: true },
    where: {
      id: listId,
    },
  });

  return NextResponse.json(data);
}
