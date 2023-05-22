'use server';
import { prisma } from '../../prisma/database';

type RemoveMaterialFromListData = {
  listId: string;
  materialId: string;
  order: number;
};

export const removeMaterialFromList = async ({
  materialId,
  listId,
  order,
}: RemoveMaterialFromListData): Promise<{ id: string }> => {
  return prisma.learningListMaterial.delete({
    select: { id: true },
    where: {
      order_learningListId_learningMaterialId: {
        learningListId: listId,
        learningMaterialId: materialId,
        order,
      },
    },
  });
};
