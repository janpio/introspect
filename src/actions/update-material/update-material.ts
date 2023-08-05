'use server';
import { prisma } from '../../prisma/database';
import { getIsAuthenticated } from '../../util/clerk';

type UpdateMaterialProperties = {
  courseName: string;
  id: string;
  instructors: string[];
  links: string[];
  publisherName: string;
};

type UpdateMaterialReturn = {
  id: string;
};

export async function updateMaterial({
  id,
  courseName,
  publisherName,
  instructors,
  links,
}: UpdateMaterialProperties): Promise<UpdateMaterialReturn | undefined> {
  const isAuthenticated = await getIsAuthenticated();

  if (isAuthenticated === null) {
    return;
  }

  const learningMaterial = await prisma.learningMaterial.update({
    data: {
      instructors,
      links: {
        createMany: {
          data: links.map(link => {
            return {
              url: link,
            };
          }),
          skipDuplicates: true,
        },
        set: links.map(link => {
          return {
            url: link,
          };
        }),
      },
      name: courseName,
      publisherName,
    },
    select: {
      id: true,
      instructors: true,
      links: { select: { url: true } },
      name: true,
      publisherName: true,
    },
    where: {
      id,
    },
  });

  await prisma.learningMaterialLink.deleteMany({
    where: {
      learningMaterialId: null,
    },
  });

  return learningMaterial;
}
