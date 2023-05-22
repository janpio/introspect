'use server';
import { prisma } from '../../prisma/database';

type AddMaterialToListData = {
  instructors: string[];
  links: string[];
  listId: string;
  listLength: number;
  name: string;
  publisherName: string;
};

export const addMaterialToList = async (
  data: AddMaterialToListData,
): Promise<{ id: string }> => {
  const learningListUpdate = prisma.learningList.update({
    data: {
      updatedAt: new Date(),
    },
    select: { id: true },
    where: {
      id: data.listId,
    },
  });

  const createMaterial = prisma.learningMaterial.create({
    data: {
      instructors: data.instructors,
      learningListMaterial: {
        create: {
          learningList: {
            connect: {
              id: data.listId,
            },
          },
          order: data.listLength,
        },
      },
      links: {
        connectOrCreate: data.links.map(link => {
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
      name: data.name,
      publisherName: data.publisherName,
    },
    select: { id: true },
  });

  const returnData = await prisma.$transaction([
    learningListUpdate,
    createMaterial,
  ]);

  return returnData[1];
};
