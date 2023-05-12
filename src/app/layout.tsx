import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import type { JSX } from 'react';

const inter = Inter({ subsets: ['latin'] });

type RootLayoutProperties = {
  children: React.ReactNode;
};

export const metadata = {
  description: 'Learn, track, share.',
  title: 'Introspect',
};

export default function RootLayout({
  children,
}: RootLayoutProperties): JSX.Element {
  return (
    <ClerkProvider>
      <html lang="en-US">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
