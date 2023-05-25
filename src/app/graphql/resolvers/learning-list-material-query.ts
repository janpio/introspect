import { type LearningListMaterial, Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';

import type { ApolloContext } from '../route';
import { resolveArguments } from '../util/resolve-arguments';
import { resolveFindMany } from '../util/resolve-find-many';
import { learningMaterial } from './learning-material-query';

export const learningListMaterialRelationships = {
  learningMaterial,
};

export async function learningListMaterial(
  parent: Record<string, unknown> | undefined,
  arguments_: Prisma.LearningListMaterialFindUniqueArgs,
  context: ApolloContext,
  info: GraphQLResolveInfo,
): Promise<LearningListMaterial | null> {
  const resolvedArguments = resolveArguments({
    arguments_,
    info,
    parent,
  });

  return context.dataSources.prisma.learningListMaterial.findUnique({
    ...resolvedArguments,
  });
}

export async function learningListMaterials(
  parent: Record<string, unknown> | undefined,
  arguments_: Prisma.LearningListMaterialFindManyArgs,
  context: ApolloContext,
  info: GraphQLResolveInfo,
): Promise<LearningListMaterial[]> {
  const resolvedArguments = resolveArguments({
    arguments_,
    info,
    parent,
    relationInfo: [
      {
        parentColumnName: Prisma.LearningListScalarFieldEnum.id,
        parentTableName: Prisma.ModelName.LearningList,
        relationColumnName:
          Prisma.LearningListMaterialScalarFieldEnum.learningListId,
        relationIndexName: 'learningListMaterial',
      },
    ],
  });

  return resolveFindMany({
    context,
    info,
    modelName: Prisma.ModelName.LearningListMaterial,
    parent,
    resolvedArguments,
  });
}
