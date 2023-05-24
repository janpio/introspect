import type { Context } from '@apollo/client';
import type { Person, Prisma } from '@prisma/client';
import type { GraphQLResolveInfo } from 'graphql';

import { prisma } from '../../../prisma/database';
import { resolveArguments } from '../util/resolve-arguments';

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
  });

  return prisma.person.findUnique({
    ...resolvedArguments,
  });
}
