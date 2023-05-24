import { PrismaSelect } from '@paljs/plugins';
import type { GraphQLResolveInfo } from 'graphql';

export const select = <Type>(info: GraphQLResolveInfo): Type => {
  const { select } = new PrismaSelect(info).value as { select: Type };

  return select;
};
