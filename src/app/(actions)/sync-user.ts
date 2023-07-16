'use server';
import { currentUser } from '@clerk/nextjs';

import { prisma } from '../../prisma/database';

export async function syncCurrentUser(): Promise<void> {
  currentUser()
    .then(user => {
      if (user) {
        prisma.person
          .upsert({
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
          })
          .catch(error => {
            console.error(error);
          });
      }
    })
    .catch(error => {
      console.error(error);
    });
}
