import { constants } from 'node:http2';

import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { createCourseSchemaWithUser } from './course-schema';

export async function POST(request: Request): Promise<NextResponse> {
  const parsed = createCourseSchemaWithUser.safeParse(await request.json());

  if (!parsed.success) {
    let errorObject = {};

    for (const error of parsed.error.errors) {
      errorObject = {
        ...errorObject,
        [error.path.join('.')]: error.message,
      };
    }

    return new NextResponse(JSON.stringify(errorObject), {
      status: constants.HTTP_STATUS_BAD_REQUEST,
    });
  }

  const { data } = parsed;

  const result = await prisma.learningList.create({
    data: {
      creator: {
        connectOrCreate: {
          create: {
            fullName: data.user?.fullName,
            profileImageUrl: data.user?.profileImage,
            username: data.user?.username,
          },
          where: {
            username: data.user?.username,
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

  return new NextResponse(JSON.stringify(result), {
    status: constants.HTTP_STATUS_OK,
  });
}
