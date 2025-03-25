'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AuthProvider from '@/components/AuthProvider';

/**
 * A custom Providers component for all app global providers
 */
export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error: any) => {
          // Don't retry if we get a 401, 403, or 404
          if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
            return false;
          }
          
          // Default React Query behavior - retry 3 times
          return failureCount < 3;
        },
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
        onError: (error: any) => {
          // Log all mutation errors for debugging
          console.error('Mutation error:', error);
        }
      }
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
} 