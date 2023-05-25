import type { LearningList } from '@prisma/client';
import { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';

import type { ApolloContext } from '../../route';
import { resolveArguments } from '../../util/resolve-arguments';
import { resolveFindMany } from '../../util/resolve-find-many';
import { learningListMaterials } from './learning-list-material-query';
import { person, persons } from './person-query';

export const learningListRelationships = {
  creator: person,
  favoritedBy: persons,
  learningListMaterials,
};

export async function learningList(
  parent: Record<string, unknown> | undefined,
  arguments_: Prisma.LearningListFindUniqueArgs,
  context: ApolloContext,
  info: GraphQLResolveInfo,
): Promise<LearningList | null> {
  const resolvedArguments = resolveArguments({
    arguments_,
    info,
    parent,
  });

  return context.dataSources.prisma.learningList.findUnique({
    ...resolvedArguments,
  });
}

export async function learningLists(
  parent: Record<string, unknown> | undefined,
  arguments_: Prisma.LearningListFindManyArgs,
  context: ApolloContext,
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
