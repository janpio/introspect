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
    select: {
      id: true,
      instructors: true,
      links: { select: { url: true } },
      name: true,
      publisherName: true,
    },
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

  const document: LearningMaterialSearchDocument = {
    id: returnData[1].id,
    instructors: returnData[1].instructors.join(','),
    links: returnData[1].links
      .map(link => {
        return link.url;
      })
      .join(','),
    name: returnData[1].name,
    publisherName: returnData[1].publisherName,
  };

  await meilisearchAdmin()
    .index(LEARNING_MATERIAL_INDEX)
    .addDocuments([document]);

  revalidateTag(learningListTags(listId)[0]);

  return NextResponse.json({ id: returnData[1].id });
}
