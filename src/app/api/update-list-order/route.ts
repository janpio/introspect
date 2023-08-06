import { constants } from 'node:http2';

import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { getIsAuthenticated } from '../../../util/clerk';
import { updateListOrderBodySchema } from './types';

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

  const {
    listId,
    materialAId,
    materialBId,
    materialACurrentOrder,
    materialBCurrentOrder,
  } = updateListOrderBodySchema.parse(await request.json());

  const results = await prisma.$transaction([
    prisma.learningListMaterial.findUnique({
      select: { id: true },
      where: {
        order_learningListId_learningMaterialId: {
          learningListId: listId,
          learningMaterialId: materialAId,
          order: materialACurrentOrder,
        },
      },
    }),
    prisma.learningListMaterial.findUnique({
      select: { id: true },
      where: {
        order_learningListId_learningMaterialId: {
          learningListId: listId,
          learningMaterialId: materialBId,
          order: materialBCurrentOrder,
        },
      },
    }),
  ]);

  if (results[0] === null || results[1] === null) {
    return NextResponse.json(
      { error: 'Not Found' },
      {
        status: constants.HTTP_STATUS_NOT_FOUND,
      },
    );
  }

  await prisma.learningListMaterial.update({
    data: {
      order: -1,
    },
    where: {
      id: results[0].id,
    },
  });
  await prisma.learningListMaterial.update({
    data: {
      order: materialACurrentOrder,
    },
    where: {
      id: results[1].id,
    },
  });
  await prisma.learningListMaterial.update({
    data: {
      order: materialBCurrentOrder,
    },
    where: {
      id: results[0].id,
    },
  });

  return NextResponse.json({});
}
