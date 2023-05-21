'use server';
import type { z } from 'zod';

import { prisma } from '../../prisma/database';
import type { createMaterialFormSchemaWithUser } from './create-list-schema';

export const updateMaterial = async (
  data: z.output<typeof createMaterialFormSchemaWithUser>,
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
