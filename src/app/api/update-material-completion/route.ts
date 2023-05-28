import { constants } from 'node:http2';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { isAuthenticated } from '../../../util/clerk';
import { learningListTags } from '../../../util/tags';
import { updateMaterialCompletionBody } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  if ((await isAuthenticated()) === null) {
    return NextResponse.json(
      { error: 'Unauthenticated' },
      { status: constants.HTTP_STATUS_UNAUTHORIZED },
    );
  }

  const { clerkId, materialId, complete, listId } =
    updateMaterialCompletionBody.parse(await request.json());

  const relation = complete
    ? { connect: { id: materialId } }
    : {
        disconnect: {
          id: materialId,
        },
      };

  const result = await prisma.person.update({
    data: {
      completedMaterial: relation,
    },
    select: { id: true },
    where: {
      clerkId,
    },
  });

  learningListTags(listId);

  return NextResponse.json(result);
}
