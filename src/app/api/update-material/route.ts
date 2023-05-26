import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { listCardTags } from '../list-card/types';
import { updateMaterialBodySchema } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { id, instructors, links, publisherName, courseName, listId } =
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
    select: { id: true },
    where: {
      id,
    },
  });

  await prisma.learningMaterialLink.deleteMany({
    where: {
      learningMaterialId: null,
    },
  });
  revalidateTag(listCardTags(listId)[0]);

  return NextResponse.json(learningMaterial);
}
