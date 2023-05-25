import './globals.css';

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import type { JSX } from 'react';

import { environment } from '../util/environment';

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

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      credentials: 'same-site',
      uri:
        environment.NODE_ENV === 'development'
          ? 'http://localhost:3000/graphql'
          : 'https://introspect.dev/graphql',
    }),
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
