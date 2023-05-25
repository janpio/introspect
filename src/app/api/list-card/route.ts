import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestBody = Object.fromEntries(request.nextUrl.searchParams) as {
    clerkId: string;
    listId: string;
  };

  const body = await prisma.$transaction([
    prisma.learningList.findUnique({
      select: {
        _count: {
          select: {
            favoritedBy: true,
          },
        },
      },
      where: {
        id: requestBody.listId,
      },
    }),
    prisma.person.findUnique({
      select: {
        favoriteLists: {
          select: { id: true },
          where: { id: requestBody.listId },
        },
      },
      where: { clerkId: requestBody.clerkId },
    }),
  ]);

  return NextResponse.json(body);
}
