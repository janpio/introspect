import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';

import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import type { JSX, ReactNode } from 'react';

import { Providers } from './(components)/providers';

const inter = Inter({ subsets: ['latin'] });

type RootLayoutProperties = {
  readonly children: ReactNode;
};

export const metadata = {
  description: 'Plan. Create. Discover. Share.',
  title: 'Introspect',
};

export default function RootLayout({
  children,
}: RootLayoutProperties): JSX.Element {
  return (
    <Providers>
      <ClerkProvider>
        <html className="bg-indigo-950" lang="en-US">
          <head>
            <link href="https://clerk.introspect.dev" rel="preconnect" />
          </head>
          <body className={inter.className}>{children}</body>
        </html>
        <Analytics />
      </ClerkProvider>
    </Providers>
  );
}
