'use client';

import * as React from 'react';

import Box from '@mui/material/Box';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type CtaImageProps = React.ComponentPropsWithoutRef<'section'>;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const CtaImage: React.FC<CtaImageProps> = (sectionProps) => (
    <Box
      component="section"
      aria-labelledby="cta-heading"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
        background: '#0A0A0F',
        pt: { xs: '80px', md: '110px' },
        pb: { xs: '80px', md: '120px' },
        textAlign: 'center',
      }}
      {...sectionProps}
    >
      {/* Multi-color radial glow */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: '-10%',
          zIndex: 0,
          background: `
            radial-gradient(closest-side at 18% 30%, rgba(91,207,255,0.30), transparent 60%),
            radial-gradient(closest-side at 82% 70%, rgba(255,176,96,0.22), transparent 60%),
            radial-gradient(closest-side at 60% 20%, rgba(255,123,197,0.22), transparent 60%),
            radial-gradient(closest-side at 35% 80%, rgba(177,123,255,0.28), transparent 60%)
          `,
          filter: 'blur(40px)',
          opacity: 0.9,
          pointerEvents: 'none',
        }}
      />

      {/* Dot grid (same as dark bento card) */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 880,
          mx: 'auto',
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
       />
    </Box>
  );

CtaImage.displayName = 'CtaImage';
