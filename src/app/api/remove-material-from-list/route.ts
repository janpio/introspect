import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { learningListTags } from '../../../util/tags';
import { removeMaterialFromListBodySchema } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { order, listId, materialId } = removeMaterialFromListBodySchema.parse(
    await request.json(),
  );

  const data = await prisma.learningListMaterial.delete({
    select: { id: true },
    where: {
      order_learningListId_learningMaterialId: {
        learningListId: listId,
        learningMaterialId: materialId,
        order,
      },
    },
  });

  revalidateTag(learningListTags(listId)[0]);

  return NextResponse.json(data);
}
