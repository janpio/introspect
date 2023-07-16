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
      id: true,
    },
  });

  return NextResponse.json(data);
}
