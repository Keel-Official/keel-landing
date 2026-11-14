'use client';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { KeelNavbar } from './keel-navbar';
import { dashboardLayoutVars } from './css-vars';
import { MainSection } from '../core/main-section';
import { LayoutSection } from '../core/layout-section';
import { FooterSection } from '../core/footer-section';

import type { MainSectionProps } from '../core/main-section';
import type { LayoutSectionProps } from '../core/layout-section';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type DashboardLayoutProps = LayoutBaseProps & {
  /** The footer's provenance line, from the hero's reading. */
  provenance?: string;
  slotProps?: {
    main?: MainSectionProps;
  };
};

const HEADER_H = { xs: 64, lg: 72 };

export function DashboardLayout({
  sx,
  cssVars,
  children,
  slotProps,
  provenance,
}: DashboardLayoutProps) {
  const theme = useTheme();

  const renderNavbar = () => (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: (_theme) => _theme.zIndex.appBar,
        }}
      >
        <KeelNavbar />
      </Box>

      <Box sx={{ height: { xs: HEADER_H.xs, lg: HEADER_H.lg } }} />
    </>
  );

  return (
    <LayoutSection
      headerSection={renderNavbar()}
      footerSection={<FooterSection provenance={provenance} />}
      cssVars={{ ...dashboardLayoutVars(theme), ...cssVars }}
      sx={sx}
    >
      <MainSection {...slotProps?.main}>{children}</MainSection>
    </LayoutSection>
  );
}
