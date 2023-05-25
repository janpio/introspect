import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { createErrorBodySchema } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const error = createErrorBodySchema.parse(await request.json());

  if (!error.message.startsWith('Hydration failed')) {
    const createdError = await prisma.error.create({
      data: {
        cause: error.cause ? JSON.stringify(error.cause) : undefined,
        message: error.message,
        name: error.name,
        stack: error.stack,
      },
      select: { id: true },
    });

    return NextResponse.json(createdError);
  }

  return NextResponse.json({ id: 'N/A' });
}
