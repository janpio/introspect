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
  return prisma.learningMaterial.update({
    data: {
      instructors: data.instructors,
      links: {
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
};
