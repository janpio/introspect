'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { JSX, PropsWithChildren, useState } from 'react';

export function Providers({ children }: PropsWithChildren): JSX.Element {
  // eslint-disable-next-line react/hook-use-state
  const [queryClient] = useState(() => {
    return new QueryClient();
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
    </QueryClientProvider>
  );
}
