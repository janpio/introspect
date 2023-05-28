import { constants } from 'node:http2';

import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { isAuthenticated } from '../../../util/clerk';
import { learningListTags } from '../../../util/tags';
import { removeMaterialFromListBodySchema } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  if ((await isAuthenticated()) === null) {
    return NextResponse.json(
      { error: 'Unauthenticated' },
      { status: constants.HTTP_STATUS_UNAUTHORIZED },
    );
  }

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
