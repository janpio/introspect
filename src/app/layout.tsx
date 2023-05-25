import './globals.css';

import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import type { JSX } from 'react';

import { ClientProvider } from './client-provider';
import { apolloServerClient } from './graphql/util/apollo';

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
  return apolloServerClient;
});

export default function RootLayout({
  children,
}: RootLayoutProperties): JSX.Element {
  return (
    <ClerkProvider>
      <html lang="en-US">
        <body className={inter.className}>
          <ClientProvider>{children}</ClientProvider>
        </body>
      </html>
      <Analytics />
    </ClerkProvider>
  );
}
