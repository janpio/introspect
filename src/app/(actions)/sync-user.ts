'use server';
import type { User } from '@clerk/backend';
import { currentUser } from '@clerk/nextjs';
import { isNil } from 'lodash';

import { prisma } from '../../prisma/database';

export async function syncCurrentUser(): Promise<User | null> {
  const user = await currentUser();

  const databaseUser = await prisma.person.findUnique({
    select: { username: true },
    where: { clerkId: user?.id },
  });

  if (
    !isNil(databaseUser) &&
    !isNil(user) &&
    databaseUser.username !== user.username
  ) {
    await prisma.person.update({
      data: {
        username: user.username,
      },
      select: { id: true },
      where: {
        clerkId: user.id,
      },
    });
  }

  return user;
}
