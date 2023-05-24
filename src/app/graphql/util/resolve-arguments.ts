import type { Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';
import { uniq } from 'lodash';

import { select } from './select';

export type RelationInfo = {
  parentCallingFunction?: string;
  parentColumnName: string;
  parentTableName: string;
  relationColumnName: string;
  relationIndexName: string;
};

export type ResolvedArguments<SelectType> = {
  rejectOnNotFound?: Prisma.RejectOnNotFound;
  select?: SelectType | null;
  where?: Record<string, unknown>;
};

type ResolveParentParameters<ArgumentsType> = {
  arguments_: ArgumentsType;
  info: GraphQLResolveInfo;
  parent?: Record<string, unknown>;
  relationInfo?: RelationInfo[];
};

export const resolveArguments = <
  ArgumentsType extends ResolvedArguments<SelectType>,
  SelectType,
>(
  parameters: ResolveParentParameters<ArgumentsType>,
  ignoreSelect = false,
): ArgumentsType => {
  const parentQuery: Record<string, unknown> | undefined = parameters.parent;

  if (parameters.relationInfo && parameters.parent) {
    const indexArray = parameters.relationInfo.map(info => {
      if (typeof info.parentCallingFunction === 'string') {
        return `${info.parentTableName}${info.parentCallingFunction}`;
      }

      return info.parentTableName;
    });

    if (indexArray.length !== uniq(indexArray).length) {
      const error = new Error(
        'If there are more than one relationships for a table, specify a calling function.',
      );
      console.error(error.message);
      throw error;
    }
  }

  // Always add select argument, whether there is a relation or not.
  let resolvedArguments = parameters.arguments_;
  if (!ignoreSelect) {
    resolvedArguments = {
      ...resolvedArguments,
      select: select<SelectType>(parameters.info),
    };
  }

  const getResolvedArguments = (relation: RelationInfo): ArgumentsType => {
    resolvedArguments = {
      ...resolvedArguments,
      ...parameters.arguments_,

      where: {
        [relation.relationColumnName]: parentQuery?.[relation.parentColumnName],
        ...parameters.arguments_.where,
      },
    };

    return resolvedArguments;
  };

  if (parameters.relationInfo && parameters.parent) {
    for (const relation of parameters.relationInfo) {
      if (parameters.info.parentType.name === relation.parentTableName) {
        if (parentQuery?.[relation.parentColumnName] === undefined) {
          throw new TypeError(
            `Must call ${relation.parentColumnName} from ${relation.parentTableName}`,
          );
        }

        if (
          typeof relation.parentCallingFunction === 'string' &&
          parameters.info.fieldName === relation.parentCallingFunction
        ) {
          return getResolvedArguments(relation);
        }

        if (typeof relation.parentCallingFunction !== 'string') {
          return getResolvedArguments(relation);
        }
      }
    }
  }

  return resolvedArguments;
};
