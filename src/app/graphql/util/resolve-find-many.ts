// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck this file is wild
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { GraphQLResolveInfo } from 'graphql';

import type { ApolloContext } from '../route';
import type { RelationInfo, ResolvedArguments } from './resolve-arguments';

type ResolveQueryParameters = {
  context: ApolloContext;
  info: GraphQLResolveInfo;
  modelName: string;
  parent: Record<string, unknown> | undefined;
  relationInfo?: RelationInfo[];
  resolvedArguments: ResolvedArguments<unknown>;
};

export const resolveFindMany = async <ModelType>(
  parameters: ResolveQueryParameters,
): Promise<ModelType[]> => {
  const lowercaseModelName = `${parameters.modelName
    .charAt(0)
    .toLowerCase()}${parameters.modelName.slice(1)}`;

  if (parameters.relationInfo) {
    for (const relation of parameters.relationInfo) {
      if (relation.parentTableName === parameters.info.parentType.name) {
        const lowercaseParentTableName = `${relation.parentTableName
          .charAt(0)
          .toLowerCase()}${relation.parentTableName.slice(1)}`;
        const model = parameters.context.dataSources.prisma[
          lowercaseParentTableName
        ] as {
          findUnique: ({ where: any }) => typeof parameters.modelName;
        };

        const relationValue = parameters.parent[relation.parentColumnName];

        if (relationValue === undefined) {
          throw new TypeError(
            `Must call ${relation.parentColumnName} from ${relation.parentTableName}`,
          );
        }

        // Try parentTable.findUnique().childTable()
        // https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance#solving-the-n1-problem
        try {
          return model
            .findUnique({
              where: {
                [relation.parentColumnName]: relationValue,
              },
            })
            [relation.relationIndexName]({
              select: parameters.resolvedArguments.select,
            }) as ModelType[];
          // If the parentTable -> childTable relationship has no index, fall back on original n + 1 issue.
          // This creates a new SELECT for every parent result
        } catch {
          console.error(
            `Make sure ${relation.parentTableName} has a foreign key constraint on ${parameters.modelName}.`,
          );

          return parameters.context.dataSources.prisma[
            lowercaseModelName
          ].findMany({
            ...parameters.resolvedArguments,
          }) as ModelType[];
        }
      }
    }
  }

  // If relationship isn't defined, use n + 1 efficiency
  return parameters.context.dataSources.prisma[lowercaseModelName].findMany({
    ...parameters.resolvedArguments,
  }) as ModelType[];
};
