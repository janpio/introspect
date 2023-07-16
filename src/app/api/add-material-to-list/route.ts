import { constants } from 'node:http2';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { isAuthenticated } from '../../../util/clerk';
import { addMaterialToListBodySchema } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  if ((await isAuthenticated()) === null) {
    return NextResponse.json(
      { error: 'Unauthenticated' },
      { status: constants.HTTP_STATUS_UNAUTHORIZED },
    );
  }

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

  return NextResponse.json({ id: returnData[1].id });
}
