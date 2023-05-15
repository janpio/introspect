'use server';
import type { User } from '@clerk/backend';
import { currentUser } from '@clerk/nextjs';

import { prisma } from '../../prisma/database';

export async function syncCurrentUser(): Promise<User | null> {
  const user = await currentUser();

  if (user) {
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
