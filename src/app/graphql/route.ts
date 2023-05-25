import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs as scalarTypeDefs } from 'graphql-scalars';
import type { NextRequest } from 'next/server';

import { prisma } from '../../prisma/database';
import { rootResolver } from './resolvers/root-resolver';
import { databaseAdditionalTypes } from './type-definitions/database-additional-types';
import { databaseInputTypeDefinitions } from './type-definitions/database-input-type-definitions';
import { databaseModelTypeDefinitions } from './type-definitions/database-model-type-definitions';
import { rootTypeDefinitions } from './type-definitions/root-type-definitions';

export type ApolloContext = {
  dataSources: {
    prisma: typeof prisma;
  };
};

const server = new ApolloServer({
  allowBatchedHttpRequests: true,

  csrfPrevention: true,
  resolvers: rootResolver,
  typeDefs: [
    ...scalarTypeDefs,
    rootTypeDefinitions,
    databaseAdditionalTypes,
    databaseInputTypeDefinitions,
    databaseModelTypeDefinitions,
  ],
});

const handler = startServerAndCreateNextHandler(server, {
  async context() {
    return {
      dataSources: {
        prisma,
      },
    };
  },
});

export async function GET(request: NextRequest): Promise<Response> {
  return handler(request);
}

export async function POST(request: NextRequest): Promise<Response> {
  return handler(request);
}
