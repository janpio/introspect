'use server';

import { prisma } from '../../prisma/database';
import { getIsAuthenticated } from '../../util/clerk';

type RemoveMaterialFromListReturn = {
  id: string;
};

export async function removeMaterialFromList(
  listId: string,
  materialId: string,
  order: number,
): Promise<RemoveMaterialFromListReturn | undefined> {
  const isAuthenticated = await getIsAuthenticated();

  if (isAuthenticated === null) {
    return;
  }

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
}
