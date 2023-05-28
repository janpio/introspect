import { constants } from 'node:http2';

import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { isAuthenticated } from '../../../util/clerk';
import { listCardTags } from '../../../util/tags';
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

  revalidateTag(listCardTags(listId)[0]);

  return NextResponse.json(data);
}
