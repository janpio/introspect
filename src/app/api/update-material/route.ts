import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import {
  LEARNING_MATERIAL_INDEX,
  type LearningMaterialSearchDocument,
  meilisearchAdmin,
} from '../../../util/meilisearch';
import { learningListTags } from '../../../util/tags';
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

  const materialDocument: LearningMaterialSearchDocument = {
    id: learningMaterial.id,
    instructors: learningMaterial.instructors.join(','),
    links: learningMaterial.links
      .map(link => {
        return link.url;
      })
      .join(','),
    name: learningMaterial.name,
    publisherName: learningMaterial.publisherName,
  };

  await Promise.all([
    prisma.learningMaterialLink.deleteMany({
      where: {
        learningMaterialId: null,
      },
    }),
    meilisearchAdmin()
      .index(LEARNING_MATERIAL_INDEX)
      .addDocuments([materialDocument]),
  ]);

  revalidateTag(learningListTags(listId)[0]);

  return NextResponse.json({ id: learningMaterial.id });
}
