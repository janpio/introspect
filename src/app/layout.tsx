import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import type { JSX } from 'react';

const inter = Inter({ subsets: ['latin'] });

type RootLayoutProperties = {
  children: React.ReactNode;
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
      <html lang="en-US">
        <head>
          <link
            href="/apple-touch-icon.png"
            rel="apple-touch-icon"
            sizes="180x180"
          />
          <link
            href="/favicon-32x32.png"
            rel="icon"
            sizes="32x32"
            type="image/png"
          />
          <link
            href="/favicon-16x16.png"
            rel="icon"
            sizes="16x16"
            type="image/png"
          />
          <link href="/site.webmanifest" rel="manifest" />
        </head>
        <body className={inter.className}>{children}</body>
      </html>
      <Analytics />
    </ClerkProvider>
  );
}
