import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ReactNode } from 'react';
import ThemeRegistry from '@/shared/ThemeRegistry/ThemeRegistry';
import StoreProvider from '@/store/StoreProvider';
import { store } from '@/store/store';
import { geoApi } from '@/entities/geo/api/geoApi';
import Auth from '@/shared/ui/Auth/Auth';
import { Snackbar } from '@/shared/ui/Snackbar/ui/Snackbar';
import NavBar from '@/shared/ui/NavBar/NavBar';
import { GoogleAnalytics } from '@next/third-parties/google';

//const inter = Inter({ subsets: ['latin'] });

store.dispatch(geoApi.endpoints.getLocation.initiate());

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <StoreProvider>
        <Auth>
          <html style={{ height: '100%' }} lang="en">
            <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
              {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && <GoogleAnalytics gaId="G-87C6D9V2J4" />}
              <ThemeRegistry>
                <NavBar />
                <Snackbar />
                <main
                  style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    backgroundColor: '#fafafa',
                  }}
                >
                  {children}
                </main>
              </ThemeRegistry>
            </body>
          </html>
        </Auth>
      </StoreProvider>
    </AppRouterCacheProvider>
  );
}
