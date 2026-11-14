import '@/global.css';

import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { themeConfig, ThemeProvider } from '@/theme';
import { DashboardLayout } from '@/layouts/dashboard';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

import { MotionLazy } from '@/components/template/animate/motion-lazy';
import { SettingsProvider } from '@/components/template/settings/context';
import { defaultSettings } from '@/components/template/settings/settings-config';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.siteUrl),
  title: CONFIG.appName,
};

// ----------------------------------------------------------------------

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" dir={defaultSettings.direction} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript
          defaultMode={themeConfig.defaultMode}
          modeStorageKey={themeConfig.modeStorageKey}
          attribute={themeConfig.cssVariables.colorSchemeSelector}
        />

        <SettingsProvider defaultSettings={defaultSettings}>
          <AppRouterCacheProvider options={{ key: 'css' }}>
            <ThemeProvider
              defaultMode={themeConfig.defaultMode}
              modeStorageKey={themeConfig.modeStorageKey}
            >
              <MotionLazy>
                <DashboardLayout>{children}</DashboardLayout>
              </MotionLazy>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
