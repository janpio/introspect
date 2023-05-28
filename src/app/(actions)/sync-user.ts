'use server';
import type { User } from '@clerk/backend';
import { currentUser } from '@clerk/nextjs';

import { prisma } from '../../prisma/database';

export async function syncCurrentUser(): Promise<User | null> {
  const user = await currentUser();

  if (user) {
    try {
      await prisma.person.upsert({
        create: {
          clerkId: user.id,
          profileImageUrl: user.imageUrl,
          username: user.username,
        },
        select: { id: true },
        update: {
          username: user.username,
        },
        where: {
          clerkId: user.id,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  return user;
}
