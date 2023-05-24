'use server';

import { prisma } from '../../prisma/database';

type CreateListData = {
  courses: Array<{
    courseName: string;
    instructors: string[];
    links: string[];
    order: number;
    publisherName: string;
  }>;
  name: string;
  user: {
    clerkId: string;
    profileImage?: string;
    username?: string;
  };
};

export const createList = async (
  data: CreateListData,
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
      learningListMaterial: {
        create: data.courses.map(course => {
          return {
            learningMaterial: {
              connectOrCreate: {
                create: {
                  instructors: course.instructors.map(instructor => {
                    return instructor.trim();
                  }),
                  links: {
                    connectOrCreate: course.links.map(link => {
                      return {
                        create: {
                          url: link.trim(),
                        },
                        where: {
                          url: link.trim(),
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
              },
            },
            order: course.order,
          };
        }),
      },
      name: data.name,
    },
    select: { id: true },
  });
};
