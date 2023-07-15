import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import type { JSX, ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

type RootLayoutProperties = {
  children: ReactNode;
};

export const metadata = {
  description: 'Plan. Create. Discover. Share.',
  title: 'Introspect',
};

export default function RootLayout({
  children,
}: RootLayoutProperties): JSX.Element {
  return (
    <ClerkProvider>
      <html className="bg-indigo-950" lang="en-US">
        <body className={inter.className}>{children}</body>
      </html>
      <Analytics />
    </ClerkProvider>
  );
}
