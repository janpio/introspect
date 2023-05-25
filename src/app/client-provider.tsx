'use client';
import {
  type ApolloClient,
  type NormalizedCacheObject,
  SuspenseCache,
} from '@apollo/client';
import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support/ssr';
import type { PropsWithChildren } from 'react';

import { apolloClientClient } from './graphql/util/apollo';

export function ClientProvider({ children }: PropsWithChildren): JSX.Element {
  return (
    <ApolloNextAppProvider
      makeClient={(): ApolloClient<NormalizedCacheObject> => {
        return apolloClientClient;
      }}
      makeSuspenseCache={(): SuspenseCache => {
        return new SuspenseCache();
      }}
    >
      {children}
    </ApolloNextAppProvider>
  );
}
