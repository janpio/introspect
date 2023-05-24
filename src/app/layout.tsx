import './globals.css';

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import type { JSX } from 'react';

const inter = Inter({ subsets: ['latin'] });

// eslint-disable-next-line unicorn/numeric-separators-style
export const revalidate = 86400;

type RootLayoutProperties = {
  children: React.ReactNode;
};

export const metadata = {
  description: 'Plan. Create. Discover. Share.',
  title: 'Introspect',
};

const httpLink = new HttpLink({
  uri: 'https://introspect-gql.onrender.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    headers: {
      ...headers,
      authorization: cookies().get('__session')?.value,
    },
  };
});

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    // eslint-disable-next-line unicorn/prefer-spread
    link: authLink.concat(httpLink),
  });
});

export default function RootLayout({
  children,
}: RootLayoutProperties): JSX.Element {
  return (
    <ClerkProvider>
      <html lang="en-US">
        <body className={inter.className}>{children}</body>
      </html>
      <Analytics />
    </ClerkProvider>
  );
}
