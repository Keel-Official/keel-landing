'use client';

import * as React from 'react';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

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

export type StatsGridProps = React.ComponentPropsWithoutRef<'section'>;

export const StatsGrid: React.FC<StatsGridProps> = (props) => (
    <SectionRoot {...props}>
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

      <Inner />
    </SectionRoot>
  );

StatsGrid.displayName = 'StatsGrid';
