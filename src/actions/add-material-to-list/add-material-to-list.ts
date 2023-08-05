'use server';

import { prisma } from '../../prisma/database';
import { getIsAuthenticated } from '../../util/clerk';

type AddMaterialToListProperties = {
  instructors: string[];
  links: string[];
  listId: string;
  listLength: number;
  name: string;
  publisherName: string;
};

type AddMaterialToListReturn = [
  { id: string },
  {
    id: string;
    instructors: string[];
    links: { url: string }[];
    name: string;
    publisherName: string;
  },
];

export async function addMaterialToList({
  listId,
  listLength,
  name,
  links,
  publisherName,
  instructors,
}: AddMaterialToListProperties): Promise<AddMaterialToListReturn | undefined> {
  const isAuthenticated = await getIsAuthenticated();

  if (isAuthenticated === null) {
    return;
  }

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

  return prisma.$transaction([learningListUpdate, createMaterial]);
}
