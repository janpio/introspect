import type { Context } from '@apollo/client';
import type { Person } from '@prisma/client';
import { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';

import { prisma } from '../../../prisma/database';
import { resolveArguments } from '../util/resolve-arguments';
import { resolveFindMany } from '../util/resolve-find-many';

export async function person(
  parent: Record<string, unknown> | undefined,
  arguments_: Prisma.PersonFindUniqueArgs,
  context: Context,
  info: GraphQLResolveInfo,
): Promise<Person | null> {
  const resolvedArguments = resolveArguments({
    arguments_,
    info,
    parent,
    relationInfo: [
      {
        parentColumnName: Prisma.LearningListScalarFieldEnum.createrId,
        parentTableName: Prisma.ModelName.LearningList,
        relationColumnName: Prisma.PersonScalarFieldEnum.id,
      },
    ],
  });

  return prisma.person.findUnique({
    ...resolvedArguments,
  });
}

export async function persons(
  parent: Record<string, unknown> | undefined,
  arguments_: Prisma.PersonFindManyArgs,
  context: Context,
  info: GraphQLResolveInfo,
): Promise<Person[]> {
  const resolvedArguments = resolveArguments({
    arguments_,
    info,
    parent,
    relationInfo: [
      {
        parentColumnName: Prisma.LearningListScalarFieldEnum.createrId,
        parentTableName: Prisma.ModelName.LearningList,
        relationColumnName: Prisma.PersonScalarFieldEnum.id,
      },
    ],
  });

  return resolveFindMany({
    context,
    info,
    modelName: Prisma.ModelName.Person,
    parent,
    resolvedArguments,
  });
}
