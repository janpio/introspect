import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import type { FavoriteListReturn } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
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
  revalidateTag(`listCard-${listId}`);

  return NextResponse.json(data);
}
