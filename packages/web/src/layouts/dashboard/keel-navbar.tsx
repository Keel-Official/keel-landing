'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import { COPY, LINKS } from '@/sections/landing-page/copy';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Button, IconButton } from '@mui/material';

// ----------------------------------------------------------------------

const NAV_LINKS: { label: string; url: string }[] = [
  { label: COPY.nav.howItWorks, url: LINKS.howItWorks },
  { label: COPY.nav.dashboard, url: LINKS.dashboard },
  { label: COPY.nav.apiDocs, url: LINKS.apiDocs },
  { label: COPY.nav.methodology, url: LINKS.methodology },
];

const lineStyle: React.CSSProperties = {
  display: 'block',
  width: '1.0rem',
  height: 2,
  margin: '2px 0',
  backgroundColor: 'currentColor',
  borderRadius: 9999,
};

const topLineVariants = {
  open: { translateY: 6, rotate: -45, transition: { duration: 0.2 } },
  closed: { translateY: 0, rotate: 0, transition: { duration: 0.2 } },
};

const middleLineVariants = {
  open: { width: 0, transition: { duration: 0.1 } },
  closed: { width: '1.0rem', transition: { duration: 0.2 } },
};

const bottomLineVariants = {
  open: { translateY: -6, rotate: 45, transition: { duration: 0.2 } },
  closed: { translateY: 0, rotate: 0, transition: { duration: 0.2 } },
};

export function KeelNavbar() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkSx = {
    textTransform: 'none',
    py: '6px',
    px: '12px',
    fontSize: '14px',
    color: 'text.primary',
    fontWeight: 500,
    borderRadius: '999px',
    minWidth: 'unset',
    '&:hover': { background: alpha(theme.palette.text.primary, 0.06) },
  } as const;

  return (
    <Box
      component="section"
      id="keel-navbar"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: (_theme) => _theme.zIndex.appBar,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderBottom: '1px solid var(--border)',
        background:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.92)
            : 'color-mix(in srgb, var(--bg) 72%, transparent)',
        backdropFilter: 'blur(14px) saturate(140%)',
        WebkitBackdropFilter: 'blur(14px) saturate(140%)',
        px: { xs: 2, lg: 4 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1400,
          mx: 'auto',
          minHeight: { xs: 64, lg: 72 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr auto', lg: 'auto 1fr' },
          alignItems: 'center',
          columnGap: 2,
        }}
      >
        {/* Text wordmark until Al supplies a logo. */}
        <Box
          component="a"
          href="/"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifySelf: 'start',
            borderRadius: '999px',
            px: '10px',
            py: '6px',
            fontSize: '20px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'text.primary',
            textDecoration: 'none',
            transition: 'background 0.15s',
            '&:hover': { background: 'var(--surface-2)' },
          }}
        >
          Keel
        </Box>

        {/* Links: desktop */}
        <Box
          component="nav"
          aria-label="Primary"
          sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 0.5 }}
        >
          {NAV_LINKS.map((link) => (
            <Button key={link.url} component="a" href={link.url} sx={linkSx}>
              {link.label}
            </Button>
          ))}
        </Box>

        {/* Menu button: mobile */}
        <IconButton
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="keel-mobile-nav"
          sx={{
            display: { xs: 'inline-flex', lg: 'none' },
            width: 32,
            height: 32,
            p: 0,
            color: 'text.primary',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <m.span
              style={lineStyle}
              animate={mobileOpen ? 'open' : 'closed'}
              variants={topLineVariants}
            />
            <m.span
              style={lineStyle}
              animate={mobileOpen ? 'open' : 'closed'}
              variants={middleLineVariants}
            />
            <m.span
              style={lineStyle}
              animate={mobileOpen ? 'open' : 'closed'}
              variants={bottomLineVariants}
            />
          </Box>
        </IconButton>
      </Box>

      {/* Links: mobile */}
      {mobileOpen ? (
        <Box
          component="nav"
          id="keel-mobile-nav"
          aria-label="Primary"
          sx={{
            display: { xs: 'flex', lg: 'none' },
            flexDirection: 'column',
            alignItems: 'flex-start',
            pb: 2,
            gap: 0.5,
          }}
        >
          {NAV_LINKS.map((link) => (
            <Button
              key={link.url}
              component="a"
              href={link.url}
              onClick={() => setMobileOpen(false)}
              sx={linkSx}
            >
              {link.label}
            </Button>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}
