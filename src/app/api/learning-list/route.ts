import { constants } from 'node:http2';

import { currentUser } from '@clerk/nextjs';
import { isNil } from 'lodash';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { prisma } from '../../../prisma/database';
import { getIsAuthenticated } from '../../../util/clerk';
import { addMaterialToListBodySchema } from './types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const user = await currentUser();
  const url = new URL(request.url);
  const listId = url.searchParams.get('listId');

  if (listId === null) {
    return NextResponse.json(
      { error: 'Invalid search params' },
      {
        status: constants.HTTP_STATUS_BAD_REQUEST,
      },
    );
  }

  const userId = user?.id ?? url.searchParams.get('userId');

  const getCompletedBy = isNil(userId)
    ? false
    : {
        select: { id: true },
        where: {
          clerkId: userId,
        },
      };

  const data = await prisma.learningList.findUnique({
    select: {
      createdAt: true,
      creator: {
        select: {
          clerkId: true,
          profileImageUrl: true,
          username: true,
        },
      },
      id: true,
      learningListMaterial: {
        orderBy: {
          order: 'asc',
        },
        select: {
          id: true,
          learningMaterial: {
            select: {
              completedBy: getCompletedBy,
              id: true,
              instructors: true,
              links: { select: { id: true, url: true } },
              name: true,
              publisherName: true,
            },
          },
          order: true,
        },
      },
      name: true,
      updatedAt: true,
    },
    where: {
      id: listId,
    },
  });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const user = await currentUser();
  const isAuthenticated = await getIsAuthenticated();

  if (user === null || isAuthenticated === null) {
    return NextResponse.json(
      { error: 'Unauthenticated' },
      { status: constants.HTTP_STATUS_NETWORK_AUTHENTICATION_REQUIRED },
    );
  }

  const { name } = await request.json();

  const data = await prisma.learningList.create({
    data: {
      creator: {
        connect: {
          clerkId: user.id,
        },
      },
      name,
    },
    select: { id: true },
  });

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const isAuthenticated = await getIsAuthenticated();

  if (isAuthenticated === null) {
    return NextResponse.json(
      { error: 'Unauthenticated' },
      { status: constants.HTTP_STATUS_NETWORK_AUTHENTICATION_REQUIRED },
    );
  }

  const { listId, listLength, name, links, publisherName, instructors } =
    addMaterialToListBodySchema.parse(await request.json());

  const learningListUpdate = prisma.learningList.update({
    data: {
      updatedAt: new Date(),
    },
    select: { id: true },
    where: {
      id: listId,
    },
  });

  const upsertData = {
    instructors,
    learningListMaterial: {
      create: {
        learningList: {
          connect: {
            id: listId,
          },
        },
        order: listLength,
      },
    },
    links: {
      connectOrCreate: links.map(link => {
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
    name,
    publisherName,
  };

  const createMaterial = prisma.learningMaterial.upsert({
    create: upsertData,
    select: {
      id: true,
      instructors: true,
      links: { select: { url: true } },
      name: true,
      publisherName: true,
    },
    update: upsertData,
    where: {
      name_publisherName_instructors: {
        instructors,
        name,
        publisherName,
      },
    },
  });

  const data = await prisma.$transaction([learningListUpdate, createMaterial]);
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const user = await currentUser();
  const isAuthenticated = await getIsAuthenticated();

  if (user === null || isAuthenticated === null) {
    return NextResponse.json(
      { error: 'Unauthenticated' },
      { status: constants.HTTP_STATUS_NETWORK_AUTHENTICATION_REQUIRED },
    );
  }

  const { listId } = await request.json();

  const results = await prisma.$transaction([
    prisma.learningListMaterial.deleteMany({
      where: {
        learningListId: listId,
      },
    }),
    prisma.learningList.update({
      data: {
        favoritedBy: {
          set: undefined,
        },
      },
      where: {
        creator: {
          clerkId: user.id,
        },
        id: listId,
      },
    }),
    prisma.learningList.delete({
      select: { id: true },
      where: {
        creator: {
          clerkId: user.id,
        },
        id: listId,
      },
    }),
  ]);

  return NextResponse.json(results[2]);
}
