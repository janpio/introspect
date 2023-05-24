import type { Context } from '@apollo/client';
import type { LearningList } from '@prisma/client';
import { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';

import { prisma } from '../../../prisma/database';
import { resolveArguments } from '../util/resolve-arguments';
import { resolveFindMany } from '../util/resolve-find-many';

export async function learningList(
  parent: Record<string, unknown> | undefined,
  arguments_: Prisma.LearningListFindUniqueArgs,
  context: Context,
  info: GraphQLResolveInfo,
): Promise<LearningList | null> {
  const resolvedArguments = resolveArguments({
    arguments_,
    info,
    parent,
  });

  return prisma.learningList.findUnique({
    ...resolvedArguments,
  });
}

export async function learningLists(
  parent: Record<string, unknown> | undefined,
  arguments_: Prisma.LearningListFindManyArgs,
  context: Context,
  info: GraphQLResolveInfo,
): Promise<LearningList[]> {
  const resolvedArguments = resolveArguments({
    arguments_,
    info,
    parent,
  });

  return resolveFindMany({
    context,
    info,
    modelName: Prisma.ModelName.LearningList,
    parent,
    resolvedArguments,
  });
}
