import type { Context } from '@apollo/client';
import type { Prisma } from '@prisma/client';
import type { LearningList } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';

import { prisma } from '../../../../prisma/database';
import { select } from '../../util/select';

type FavoriteListArguments = {
  clerkId: string;
  isAdding: boolean;
  listId: string;
};

export async function favoriteList(
  parent: unknown,
  arguments_: FavoriteListArguments,
  context: Context,
  info: GraphQLResolveInfo,
): Promise<LearningList | object | null> {
  return prisma.learningList.update({
    data: {
      favoritedBy: arguments_.isAdding
        ? { connect: { clerkId: arguments_.clerkId } }
        : { disconnect: { clerkId: arguments_.clerkId } },
    },
    select: select<Prisma.LearningListSelect>(info),
    where: {
      id: arguments_.listId,
    },
  });
}
