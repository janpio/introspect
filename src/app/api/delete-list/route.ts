import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { listPageTags } from '../../../util/tags';
import { deleteListBodySchema } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { listId } = deleteListBodySchema.parse(await request.json());

  const data = await prisma.$transaction([
    prisma.learningListMaterial.deleteMany({
      where: {
        learningListId: listId,
      },
    }),
    prisma.learningList.update({
      data: {
        favoritedBy: {
          set: undefined,
        },
      },
      where: {
        id: listId,
      },
    }),
    prisma.learningList.delete({
      select: { id: true },
      where: {
        id: listId,
      },
    }),
  ]);

  revalidateTag(listPageTags()[0]);

  return NextResponse.json(data[2]);
}
