import { constants } from 'node:http2';

import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';

export async function GET(): Promise<NextResponse> {
  const user = await currentUser();

  if (user === null) {
    return NextResponse.json(
      { error: 'User not found' },
      {
        status: constants.HTTP_STATUS_UNAUTHORIZED,
      },
    );
  }

  const data = await prisma.learningList.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      creator: {
        clerkId: user?.id,
      },
    },
  });

  return NextResponse.json(data);
}
