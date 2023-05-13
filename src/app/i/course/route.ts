import { NextResponse } from 'next/server';

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
      status: 500,
    });
  }

  return new NextResponse();
}
