'use client';

import * as React from 'react';

import Box from '@mui/material/Box';

import { COPY, LINKS } from '../copy';

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
      background: 'var(--ink)',
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
    >
      {/* Heading */}
      <Box
        component="h2"
        id="cta-heading"
        sx={{
          m: 0,
          fontSize: 'clamp(40px, 6vw, 80px)',
          fontWeight: 500,
          letterSpacing: '-0.03em',
          lineHeight: 1.08,
          color: 'var(--on-ink)',
        }}
      >
        {COPY.closing.title}
      </Box>

      {/* Buttons */}
      <Box
        sx={{
          mt: '30px',
          display: 'inline-flex',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Box
          component="a"
          href={LINKS.dashboard}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 48,
            px: '24px',
            borderRadius: '999px',
            bgcolor: 'var(--accent)',
            color: 'var(--on-brand)',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'background 150ms, transform 150ms',
            '&:hover': { bgcolor: 'var(--accent-strong)', transform: 'translateY(-1px)' },
          }}
        >
          {COPY.closing.primaryCta}
        </Box>
        <Box
          component="a"
          href={LINKS.methodology}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 48,
            px: '24px',
            borderRadius: '999px',
            bgcolor: 'rgba(255,255,255,0.08)',
            color: 'var(--on-ink)',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.16)',
            transition: 'background 150ms, border-color 150ms, transform 150ms',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.14)',
              borderColor: 'rgba(255,255,255,0.24)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          {COPY.closing.secondaryCta}
        </Box>
      </Box>
    </Box>
  </Box>
);

CtaImage.displayName = 'CtaImage';
