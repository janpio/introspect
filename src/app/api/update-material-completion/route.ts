import { constants } from 'node:http2';

import { currentUser } from '@clerk/nextjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { getIsAuthenticated } from '../../../util/clerk';
import { updateMaterialCompletionBodySchema } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const isAuthenticated = await getIsAuthenticated();
  const user = await currentUser();

  if (isAuthenticated === null || user === null) {
    return NextResponse.json(
      { error: 'Unauthenticated' },
      {
        status: constants.HTTP_STATUS_UNAUTHORIZED,
      },
    );
  }

  const { complete, materialId } = updateMaterialCompletionBodySchema.parse(
    await request.json(),
  );

  const relation = complete
    ? { connect: { id: materialId } }
    : {
        disconnect: {
          id: materialId,
        },
      };

  const data = await prisma.person.update({
    data: {
      completedMaterial: relation,
    },
    select: { id: true },
    where: {
      clerkId: user.id,
    },
  });

  return NextResponse.json(data);
}
