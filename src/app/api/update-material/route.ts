import { constants } from 'node:http2';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { getIsAuthenticated } from '../../../util/clerk';
import { updateMaterialBodySchema } from './types';

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

  const { instructors, id, publisherName, links, courseName } =
    updateMaterialBodySchema.parse(await request.json());

  const learningMaterial = await prisma.learningMaterial.update({
    data: {
      instructors,
      links: {
        createMany: {
          data: links.map(link => {
            return {
              url: link,
            };
          }),
          skipDuplicates: true,
        },
        set: links.map(link => {
          return {
            url: link,
          };
        }),
      },
      name: courseName,
      publisherName,
    },
    select: {
      id: true,
      instructors: true,
      links: { select: { url: true } },
      name: true,
      publisherName: true,
    },
    where: {
      id,
    },
  });

  await prisma.learningMaterialLink.deleteMany({
    where: {
      learningMaterialId: null,
    },
  });

  return NextResponse.json(learningMaterial);
}
