import type { FetchPolicy } from '@apollo/client';
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  type Reference,
} from '@apollo/client';
import {
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';

type DefaultQueryOptions = {
  context: { fetchOptions: { next: { revalidate: number } } };
  fetchPolicy: FetchPolicy;
};

export const defaultQueryOptions: DefaultQueryOptions = {
  context: {
    fetchOptions: { next: { revalidate: 86_400 } },
  },
  fetchPolicy: 'cache-first',
};

const apolloHttpLink = new HttpLink({
  uri:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/graphql'
      : 'https://introspect.dev/graphql',
});

export const apolloServerClient = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          learningList: {
            read(_, { args, toReference }): Reference | undefined {
              return toReference({
                __typename: 'LearningList',
                id: args?.id as string,
              });
            },
          },
        },
      },
    },
  }),
  credentials: 'same-origin',
  link: apolloHttpLink,
});

export const apolloClientClient = new ApolloClient({
  cache: new NextSSRInMemoryCache(),
  link:
    typeof window === 'undefined'
      ? ApolloLink.from([
          new SSRMultipartLink({
            stripDefer: true,
          }),
          apolloHttpLink,
        ])
      : apolloHttpLink,
});
