import { constants } from 'node:http2';

import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { getIsAuthenticated } from '../../../util/clerk';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const isAuthenticated = await getIsAuthenticated();

  if (isAuthenticated === null) {
    return NextResponse.json(
      { error: 'Unauthenticated' },
      {
        status: constants.HTTP_STATUS_UNAUTHORIZED,
      },
    );
  }

  const { listId, materialId, order } = await request.json();

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

  return NextResponse.json(data);
}
