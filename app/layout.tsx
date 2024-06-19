'use client';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ReactNode } from 'react';
import ThemeRegistry from '@/shared/ThemeRegistry/ThemeRegistry';
import StoreProvider from '@/store/StoreProvider';
import { store } from '@/store/store';
import { geoApi } from '@/entities/geo/api/geoApi';
import Auth from '@/shared/ui/Auth/Auth';
import { Snackbar } from '@/shared/ui/Snackbar/ui/Snackbar';
import NavBar from '@/shared/ui/NavBar/NavBar';
import CssBaseline from '@mui/material/CssBaseline';

const inter = Inter({ subsets: ['latin'] });

const metadata: Metadata = {
  title: 'TireToad',
  description: 'Mobile tire repair everywhere',
};

store.dispatch(geoApi.endpoints.getLocation.initiate());

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <StoreProvider>
        <Auth>
          <ThemeRegistry>
            <CssBaseline />
            <html style={{ height: '100%' }} lang="en">
              <body className={inter.className} style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', paddingBottom: '24px' }}>
                <NavBar />
                <Snackbar />
                <main style={{ display: 'flex', flex: 1 }}>{children}</main>
              </body>
            </html>
          </ThemeRegistry>
        </Auth>
      </StoreProvider>
    </AppRouterCacheProvider>
  );
}
