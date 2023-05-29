'use server';
import { currentUser } from '@clerk/nextjs';
import type { User } from '@clerk/nextjs/server';

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
