'use server';
import { currentUser } from '@clerk/nextjs';

import { prisma } from '../../prisma/database';
import { getIsAuthenticated } from '../../util/clerk';

type UpdateMaterialCompletionProperties = {
  complete: boolean;
  materialId: string;
};

type UpdateMaterialCompletionReturn = {
  id: string;
};

export async function updateMaterialCompletion({
  complete,
  materialId,
}: UpdateMaterialCompletionProperties): Promise<
  UpdateMaterialCompletionReturn | undefined
> {
  const isAuthenticated = await getIsAuthenticated();
  const user = await currentUser();

  if (isAuthenticated === null || user === null) {
    return;
  }

  const relation = complete
    ? { connect: { id: materialId } }
    : {
        disconnect: {
          id: materialId,
        },
      };

  return prisma.person.update({
    data: {
      completedMaterial: relation,
    },
    select: { id: true },
    where: {
      clerkId: user.id,
    },
  });
}
