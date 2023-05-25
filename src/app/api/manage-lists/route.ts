import { type NextRequest, NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { manageListsParametersSchema } from './types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { clerkId } = manageListsParametersSchema.parse(
    Object.entries(request.nextUrl.searchParams),
  );

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
