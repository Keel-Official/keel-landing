import '@/global.css';

import type { Metadata } from 'next';

import { CONFIG } from '@/global-config';
import { COPY } from '@/sections/landing-page/copy';
import { themeConfig, ThemeProvider } from '@/theme';
import { DashboardLayout } from '@/layouts/dashboard';
import { readHero } from '@/lib/keel/landing/readings';
import { provenanceLine } from '@/sections/landing-page/reading';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

import { MotionLazy } from '@/components/template/animate/motion-lazy';
import { SettingsProvider } from '@/components/template/settings/context';
import { defaultSettings } from '@/components/template/settings/settings-config';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.siteUrl),
  title: COPY.meta.title,
  description: COPY.hero.subline,
  // A plain text mark until Al supplies the Keel favicon.
  icons: [{ rel: 'icon', url: '/icon.svg', type: 'image/svg+xml' }],
};

// ----------------------------------------------------------------------

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  // The same per-request reading the page shows, so the footer cannot disagree with it.
  const hero = await readHero();

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
                <DashboardLayout provenance={provenanceLine(hero)}>{children}</DashboardLayout>
              </MotionLazy>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
