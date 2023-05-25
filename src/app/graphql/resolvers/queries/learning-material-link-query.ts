import { type LearningMaterialLink, Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';

import type { ApolloContext } from '../../route';
import {
  type RelationInfo,
  resolveArguments,
} from '../../util/resolve-arguments';
import { resolveFindMany } from '../../util/resolve-find-many';

export async function learningMaterialLink(
  parent: Record<string, unknown> | undefined,
  arguments_: Prisma.LearningMaterialLinkFindUniqueArgs,
  context: ApolloContext,
  info: GraphQLResolveInfo,
): Promise<LearningMaterialLink | null> {
  const resolvedArguments = resolveArguments({
    arguments_,
    info,
    parent,
  });

  return context.dataSources.prisma.learningMaterialLink.findUnique({
    ...resolvedArguments,
  });
}

export async function learningMaterialLinks(
  parent: Record<string, unknown> | undefined,
  arguments_: Prisma.LearningMaterialLinkFindManyArgs,
  context: ApolloContext,
  info: GraphQLResolveInfo,
): Promise<LearningMaterialLink[]> {
  const relationInfo: RelationInfo[] = [
    {
      parentColumnName: Prisma.LearningMaterialScalarFieldEnum.id,
      parentTableName: Prisma.ModelName.LearningMaterial,
      relationColumnName:
        Prisma.LearningMaterialLinkScalarFieldEnum.learningMaterialId,
      relationIndexName: 'links',
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
    modelName: Prisma.ModelName.LearningMaterialLink,
    parent,
    relationInfo,
    resolvedArguments,
  });
}
