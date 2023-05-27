import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { listPageTags } from '../../../util/tags';
import { createListBodySchema } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
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

  revalidateTag(listPageTags()[0]);

  return NextResponse.json(list);
}
