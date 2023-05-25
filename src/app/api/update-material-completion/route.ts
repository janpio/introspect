import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { updateMaterialCompletionBody } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { clerkId, materialId, complete } = updateMaterialCompletionBody.parse(
    await request.json(),
  );

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

  return NextResponse.json(result);
}
