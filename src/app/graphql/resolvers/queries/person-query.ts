import type { Person } from '@prisma/client';
import { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';
import { isEqual } from 'lodash';

import type { ApolloContext } from '../../route';
import {
  type RelationInfo,
  resolveArguments,
} from '../../util/resolve-arguments';
import { resolveFindMany } from '../../util/resolve-find-many';

export async function person(
  parent: Record<string, unknown> | undefined,
  arguments_: Prisma.PersonFindUniqueArgs,
  context: ApolloContext,
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
        relationIndexName: 'creator',
      },
    ],
  });

  if (isEqual(resolvedArguments.where, {})) {
    return null;
  }

  return context.dataSources.prisma.person.findUnique({
    ...resolvedArguments,
  });
}

export async function persons(
  parent: Record<string, unknown> | undefined,
  arguments_: Prisma.PersonFindManyArgs,
  context: ApolloContext,
  info: GraphQLResolveInfo,
): Promise<Person[]> {
  const relationInfo: RelationInfo[] = [
    {
      parentColumnName: Prisma.LearningListScalarFieldEnum.createrId,
      parentTableName: Prisma.ModelName.LearningList,
      relationColumnName: Prisma.PersonScalarFieldEnum.id,
      relationIndexName: 'favoritedBy',
    },
  ];

  const resolvedArguments = resolveArguments({
    arguments_,
    info,
    parent,
    relationInfo,
  });

  return resolveFindMany({
    context,
    info,
    modelName: Prisma.ModelName.Person,
    parent,
    relationInfo,
    resolvedArguments,
  });
}
