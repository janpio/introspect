import { isNil } from 'lodash';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { createFavoriteSchema } from './schema';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = createFavoriteSchema.parse(await request.json());

  const action = body.hasUserFavorited
    ? {
        disconnect: {
          id: body.listId,
        },
      }
    : {
        connect: {
          id: body.listId,
        },
      };

  const nonUpdated = await prisma.person.findUnique({
    select: { id: true },
    where: { clerkId: body.clerkId },
  });

  if (!isNil(nonUpdated)) {
    const person = await prisma.person
      .update({
        data: {
          favoriteLists: action,
        },
        select: { id: true },
        where: {
          id: nonUpdated.id,
        },
      })
      .catch(error => {
        console.error(error);
        NextResponse.json(error, { status: 500 });
      });

    return NextResponse.json(person);
  }

  return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
}
