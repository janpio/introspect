'use server';

import { db } from '@vercel/postgres';
import { isNil } from 'lodash';

import { prisma } from '../../../prisma/database';

export async function favoriteList(
  clerkId: string,
  listId: string,
  hasFavorited: boolean,
): Promise<void> {
  const client = await db.connect();

  const user = await prisma.person.findUnique({
    select: { id: true },
    where: { clerkId },
  });

  if (!isNil(user) && !hasFavorited) {
    await client.sql`insert into "verceldb".public."_favoriteList"("A", "B")
                     values (${listId}, ${user.id})`.catch(() => {
      // Do nothing
    });
  } else if (!isNil(user) && hasFavorited) {
    await client.sql`delete from "verceldb".public."_favoriteList" where "A" = ${listId} and "B" = ${user.id}`.catch(
      () => {
        // Do nothing
      },
    );
  }
}
