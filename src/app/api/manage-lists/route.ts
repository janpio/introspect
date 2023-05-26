import { isNil } from 'lodash';
import { type NextRequest, NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const clerkId = request.nextUrl.searchParams.get('clerkId');

  if (isNil(clerkId)) {
    return NextResponse.json({ error: 'Invalid Parameters' });
  }

  const data = await prisma.learningList.findMany({
    select: {
      createdAt: true,
      creator: {
        select: {
          profileImageUrl: true,
          username: true,
        },
      },
      id: true,
      name: true,
      updatedAt: true,
    },
    where: {
      creator: {
        clerkId,
      },
    },
  });

  return NextResponse.json(data);
}
