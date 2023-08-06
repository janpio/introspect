import { constants } from 'node:http2';

import { currentUser } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { getIsAuthenticated } from '../../../util/clerk';
import { favoriteListBodySchema } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const user = await currentUser();
  const isAuthenticated = await getIsAuthenticated();

  if (user === null || isAuthenticated === null) {
    return NextResponse.json(
      { error: 'Unauthenticated' },
      {
        status: constants.HTTP_STATUS_UNAUTHORIZED,
      },
    );
  }

  const { listId, isAdding } = favoriteListBodySchema.parse(
    await request.json(),
  );

  const data = await prisma.learningList.update({
    data: {
      favoritedBy: isAdding
        ? { connect: { clerkId: user.id } }
        : { disconnect: { clerkId: user.id } },
    },
    select: { id: true },
    where: {
      id: listId,
    },
  });

  return NextResponse.json(data);
}
