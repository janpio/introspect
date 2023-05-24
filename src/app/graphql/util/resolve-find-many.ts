// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck this file is wild
/* eslint-disable @typescript-eslint/no-unsafe-call,functional/immutable-data,@typescript-eslint/no-dynamic-delete */
import type { Context } from '@apollo/client';
import type { GraphQLResolveInfo } from 'graphql';

import { prisma } from '../../../prisma/database';
import type { RelationInfo, ResolvedArguments } from './resolve-arguments';

type ResolveQueryParameters = {
  context: Context;
  info: GraphQLResolveInfo;
  modelName: string;
  parent: Record<string, unknown> | undefined;
  relationInfo?: RelationInfo[];
  resolvedArguments: ResolvedArguments<unknown>;
};

/*
 * In relationships provide index name if it exists.
 * Reference node_modules\.prisma\client\index.d.ts
 * ex. DomainUsers -> Bills created by DomainUser
 * ex. DomainUser.Bill_Bill_CreatedByToDomainUser, relationInfo.relationIndexName = 'Bill_Bill_CreatedByToDomainUser'
 */
export const resolveFindMany = async <ModelType>(
  parameters: ResolveQueryParameters,
): Promise<ModelType[]> => {
  if (parameters.relationInfo) {
    for (const relation of parameters.relationInfo) {
      if (relation.parentTableName === parameters.info.parentType.name) {
        const model = prisma[
          `${relation.parentTableName
            .charAt(0)
            .toLowerCase()}${relation.parentTableName.slice(1)}`
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
          delete parameters.resolvedArguments.where[
            relation.relationColumnName
          ];

          return model
            .findUnique({
              where: {
                [relation.parentColumnName]: relationValue,
              },
            })
            [
              typeof relation.relationIndexName === 'string'
                ? relation.relationIndexName
                : parameters.modelName
            ]({
              ...parameters.resolvedArguments,
            }) as ModelType[];
          // If the parentTable -> childTable relationship has no index, fall back on original n + 1 issue.
          // This creates a new SELECT for every parent result
        } catch {
          console.error(
            `Make sure ${relation.parentTableName} has a foreign key constraint on ${parameters.modelName}.`,
          );

          // This value was deleted above, readd
          parameters.resolvedArguments.where[relation.relationColumnName] =
            relationValue;

          return prisma[
            `${parameters.modelName
              .charAt(0)
              .toLowerCase()}${parameters.modelName.slice(1)}`
          ].findMany({
            ...parameters.resolvedArguments,
          }) as ModelType[];
        }
      }
    }
  }

  // If relationship isn't defined, use n + 1 efficiency
  return prisma[
    `${parameters.modelName
      .charAt(0)
      .toLowerCase()}${parameters.modelName.slice(1)}`
  ].findMany({
    ...parameters.resolvedArguments,
  }) as ModelType[];
};
