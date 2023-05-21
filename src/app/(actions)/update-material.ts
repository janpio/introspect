'use server';

import { prisma } from '../../prisma/database';

type UpdateMaterialData = {
  courseName: string;
  id: string;
  instructors: string[];
  links: string[];
  publisherName: string;
  user: {
    clerkId: string;
    profileImage: string;
    username: string;
  };
};

export const updateMaterial = async (
  data: UpdateMaterialData,
): Promise<{ id: string }> => {
  const learningMaterial = await prisma.learningMaterial.update({
    data: {
      instructors: data.instructors,
      links: {
        createMany: {
          data: data.links.map(link => {
            return {
              url: link,
            };
          }),
          skipDuplicates: true,
        },
        set: data.links.map(link => {
          return {
            url: link,
          };
        }),
      },
      name: data.courseName,
      publisherName: data.publisherName,
    },
    select: { id: true },
    where: {
      id: data.id,
    },
  });

  await prisma.learningMaterialLink.deleteMany({
    where: {
      learningMaterialId: null,
    },
  });

  return learningMaterial;
};
