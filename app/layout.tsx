import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ReactNode } from 'react';
import ThemeRegistry from '@/shared/ThemeRegistry/ThemeRegistry';
import StoreProvider from '@/app/StoreProvider';
import { store } from '@/app/store';
import { geoApi } from '@/entities/geo/api/geoApi';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TireToad',
  description: 'Mobile tire repair everywhere',
};

store.dispatch(geoApi.endpoints.getLocation.initiate());

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <AppRouterCacheProvider>
        <StoreProvider>
          <ThemeRegistry>
            <body className={inter.className} style={{ height: '100%' }}>
              {children}
            </body>
          </ThemeRegistry>
        </StoreProvider>
      </AppRouterCacheProvider>
    </html>
  );
}
