'use server';
import type { z } from 'zod';

import { prisma } from '../../prisma/database';
import type { createCourseSchemaWithUser } from './create-list-schema';

export const createList = async (
  data: z.output<typeof createCourseSchemaWithUser>,
): Promise<{ id: string }> => {
  return prisma.learningList.create({
    data: {
      creator: {
        connectOrCreate: {
          create: {
            clerkId: data.user.clerkId,
            profileImageUrl: data.user.profileImage,
            username: data.user.username,
          },
          where: {
            clerkId: data.user.clerkId,
          },
        },
      },
      learningMaterials: {
        connectOrCreate: data.courses.map(course => {
          return {
            create: {
              instructors: course.instructors,
              links: {
                connectOrCreate: course.links.map(link => {
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
              name: course.courseName,
              publisherName: course.publisherName,
            },
            where: {
              name_publisherName: {
                name: course.courseName,
                publisherName: course.publisherName,
              },
            },
          };
        }),
      },
      name: data.name,
    },
    select: { id: true },
  });
};
