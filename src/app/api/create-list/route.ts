import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { createListBodySchema } from './types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const data = createListBodySchema.parse(await request.json());

  const list = await prisma.learningList.create({
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

  return NextResponse.json(list);
}
