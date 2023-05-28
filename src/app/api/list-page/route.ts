import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';

export async function GET(): Promise<NextResponse> {
  const data = await prisma.learningList.findMany({
    orderBy: {
      favoritedBy: {
        _count: 'desc',
      },
    },
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
  });

  return NextResponse.json(data);
}
