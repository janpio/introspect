'use server';

import { prisma } from '../../prisma/database';

type CompleteMaterialData = {
  clerkId: string;
  complete: boolean;
  materialId: string;
};

export const updateMaterialCompletion = async ({
  clerkId,
  materialId,
  complete,
}: CompleteMaterialData): Promise<{ id: string }> => {
  const relation = complete
    ? { connect: { id: materialId } }
    : {
        disconnect: {
          id: materialId,
        },
      };

  const result = await prisma.person.update({
    data: {
      completedMaterial: relation,
    },
    select: { id: true },
    where: {
      clerkId,
    },
  });

  console.log(result);

  return result;
};
