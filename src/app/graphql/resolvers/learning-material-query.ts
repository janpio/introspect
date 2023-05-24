import type { Context } from '@apollo/client';
import { type LearningMaterial, Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';

import { prisma } from '../../../prisma/database';
import { resolveArguments } from '../util/resolve-arguments';
import { resolveFindMany } from '../util/resolve-find-many';
import { learningMaterialLinks } from './learning-material-link-query';
import { persons } from './person-query';

export const learningMaterialRelationships = {
  completedBy: persons,
  links: learningMaterialLinks,
};

export async function learningMaterial(
  parent: Record<string, unknown> | undefined,
  arguments_: Prisma.LearningMaterialFindUniqueArgs,
  context: Context,
  info: GraphQLResolveInfo,
): Promise<LearningMaterial | null> {
  const resolvedArguments = resolveArguments({
    arguments_,
    info,
    parent,
    relationInfo: [
      {
        parentColumnName:
          Prisma.LearningListMaterialScalarFieldEnum.learningMaterialId,
        parentTableName: Prisma.ModelName.LearningListMaterial,
        relationColumnName: Prisma.LearningMaterialScalarFieldEnum.id,
        relationIndexName: 'learningMaterial',
      },
    ],
  });

  return prisma.learningMaterial.findUnique({
    ...resolvedArguments,
  });
}

export async function learningMaterials(
  parent: Record<string, unknown> | undefined,
  arguments_: Prisma.LearningListMaterialFindManyArgs,
  context: Context,
  info: GraphQLResolveInfo,
): Promise<LearningMaterial[]> {
  const resolvedArguments = resolveArguments({
    arguments_,
    info,
    parent,
  });

  return resolveFindMany({
    context,
    info,
    modelName: Prisma.ModelName.LearningMaterial,
    parent,
    resolvedArguments,
  });
}
