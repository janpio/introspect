import { constants } from 'node:http2';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { isAuthenticated } from '../../../util/clerk';
import { createListBodySchema } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  if ((await isAuthenticated()) === null) {
    return NextResponse.json(
      { error: 'Unauthenticated' },
      { status: constants.HTTP_STATUS_UNAUTHORIZED },
    );
  }

  const { clerkId, name } = createListBodySchema.parse(await request.json());

  const list = await prisma.learningList.create({
    data: {
      creator: {
        connect: {
          clerkId,
        },
      },
      name,
    },
    select: { id: true },
  });

  return NextResponse.json(list);
}
