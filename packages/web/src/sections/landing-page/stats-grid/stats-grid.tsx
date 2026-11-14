'use client';

import * as React from 'react';
import { fill } from '@/lib/keel/format/fill';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import { COPY, LINKS } from '../copy';

// ----------------------------------------------------------------------

const MONO = {
  fontFamily: '"Geist Mono", ui-monospace, monospace',
  fontFeatureSettings: '"ss01","ss02","zero"',
  fontVariantNumeric: 'tabular-nums',
} as const;

const TILE_SX = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '20px',
  p: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  backdropFilter: 'blur(8px)',
  transition: 'border-color 200ms, background 200ms',
  '&:hover': {
    background: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.12)',
  },
} as const;

const BUTTON_SX = {
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
  height: 40,
  px: '18px',
  mt: 'auto',
  borderRadius: '999px',
  fontSize: '14px',
  fontWeight: 600,
  textDecoration: 'none',
  bgcolor: '#fff',
  color: '#0A0A0F',
  transition: 'background 150ms, transform 150ms',
  '&:hover': { bgcolor: '#f4f4f7', transform: 'translateY(-1px)' },
} as const;

/** The MCP command, with a control that copies it. */
function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = COPY.waysIn;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        pl: '12px',
        pr: '6px',
        py: '6px',
      }}
    >
      <Box
        component="code"
        sx={{ ...MONO, fontSize: '13px', color: '#fff', flex: 1, minWidth: 0, overflowX: 'auto' }}
      >
        {command}
      </Box>
      <Box
        component="button"
        type="button"
        onClick={onCopy}
        aria-live="polite"
        sx={{
          flexShrink: 0,
          cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.16)',
          borderRadius: '8px',
          background: 'transparent',
          color: 'rgba(255,255,255,0.85)',
          fontSize: '12px',
          fontWeight: 500,
          px: '10px',
          py: '4px',
          '&:hover': { background: 'rgba(255,255,255,0.08)' },
        }}
      >
        {copied ? copy.copied : copy.copy}
      </Box>
    </Box>
  );
}

const SectionRoot = styled('section')({
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#0A0A0F',
  color: '#fff',
  isolation: 'isolate',
});

const Inner = styled('div')(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  maxWidth: 1200,
  margin: '0 auto',
  padding: `${theme.spacing(13)} ${theme.spacing(3)}`,
}));

// ----------------------------------------------------------------------

export type StatsGridProps = React.ComponentPropsWithoutRef<'section'> & {
  /** `total` from `/assets`, or the saved list's when the API does not answer. */
  assetCount: number;
};

/** `docs/landing-copy.md` section 6: three ways in. */
export const StatsGrid: React.FC<StatsGridProps> = ({ assetCount, ...props }) => {
  const copy = COPY.waysIn;
  const tiles = [
    {
      name: copy.dashboard.name,
      body: fill(copy.dashboard.body, { assetCount }),
      button: copy.dashboard.button,
      href: LINKS.dashboard,
      external: false,
    },
    {
      name: copy.api.name,
      body: copy.api.body,
      button: copy.api.button,
      href: LINKS.apiDocs,
      external: false,
    },
    {
      name: copy.agents.name,
      body: copy.agents.body,
      command: copy.agents.command,
      button: copy.agents.button,
      href: LINKS.mcp,
      external: true,
    },
  ];

  return (
    <SectionRoot aria-labelledby="ways-heading" {...props}>
      {/* Aurora glow */}
      <Box
        sx={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          pointerEvents: 'none',
          background: [
            'radial-gradient(closest-side at 15% 30%, rgba(91,207,255,0.22), transparent 60%)',
            'radial-gradient(closest-side at 85% 70%, rgba(255,176,96,0.16), transparent 60%)',
            'radial-gradient(closest-side at 60% 15%, rgba(255,123,197,0.16), transparent 60%)',
            'radial-gradient(closest-side at 35% 85%, rgba(177,123,255,0.22), transparent 60%)',
          ].join(','),
          filter: 'blur(40px)',
          opacity: 0.85,
        }}
      />

      {/* Dot grid */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)',
        }}
      />

      <Inner>
        <Box
          component="h2"
          id="ways-heading"
          sx={{
            m: 0,
            fontSize: 'clamp(34px, 4.4vw, 56px)',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            color: '#fff',
          }}
        >
          {copy.title}
        </Box>

        <Box
          sx={{
            mt: '56px',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: '14px',
          }}
        >
          {tiles.map((tile) => (
            <Box key={tile.name} sx={TILE_SX}>
              <Box
                component="p"
                sx={{ m: 0, fontSize: '15px', lineHeight: 1.6, color: 'rgba(255,255,255,0.65)' }}
              >
                <Box component="strong" sx={{ color: '#fff', fontWeight: 600 }}>
                  {tile.name}
                </Box>{' '}
                {tile.body}
              </Box>
              {tile.command ? <CopyCommand command={tile.command} /> : null}
              <Box
                component="a"
                href={tile.href}
                {...(tile.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                sx={BUTTON_SX}
              >
                {tile.button}
              </Box>
            </Box>
          ))}
        </Box>
      </Inner>
    </SectionRoot>
  );
};

StatsGrid.displayName = 'StatsGrid';
