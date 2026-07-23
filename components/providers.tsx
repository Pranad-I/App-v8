'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { AppDataProvider } from '@/lib/store';
import { AuthGate } from '@/components/AuthGate';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <AuthGate>
        <AppDataProvider>{children}</AppDataProvider>
      </AuthGate>
    </ThemeProvider>
  );
}
