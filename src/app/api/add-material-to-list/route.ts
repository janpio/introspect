import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import {
  LEARNING_MATERIAL_INDEX,
  meilisearchAdmin,
} from '../../../util/meilisearch';
import { learningListTags } from '../learning-list/types';
import { addMaterialToListBodySchema } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { instructors, publisherName, name, links, listId, listLength } =
    addMaterialToListBodySchema.parse(await request.json());

  const learningListUpdate = prisma.learningList.update({
    data: {
      updatedAt: new Date(),
    },
    select: { id: true },
    where: {
      id: listId,
    },
  });

  const upsertData = {
    instructors,
    learningListMaterial: {
      create: {
        learningList: {
          connect: {
            id: listId,
          },
        },
        order: listLength,
      },
    },
    links: {
      connectOrCreate: links.map(link => {
        return {
          create: {
            url: link,
          },
          where: {
            url: link,
          },
        };
      }),
    },
    name,
    publisherName,
  };

  const createMaterial = prisma.learningMaterial.upsert({
    create: upsertData,
    select: { id: true },
    update: upsertData,
    where: {
      name_publisherName_instructors: {
        instructors,
        name,
        publisherName,
      },
    },
  });

  const returnData = await prisma.$transaction([
    learningListUpdate,
    createMaterial,
  ]);
  revalidateTag(learningListTags(listId)[0]);

  await meilisearchAdmin()
    .index(LEARNING_MATERIAL_INDEX)
    .addDocuments([returnData[1]]);

  return NextResponse.json(returnData[1]);
}
