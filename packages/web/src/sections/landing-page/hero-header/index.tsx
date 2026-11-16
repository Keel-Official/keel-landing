'use client';

import type { LandingReading } from '@/lib/keel/landing/readings';

import * as React from 'react';

import { Box, Stack, Container, Typography } from '@mui/material';

import { COPY, LINKS } from '../copy';
import { ReadingCard } from './reading-card';

const BUTTON_SX = {
  display: 'inline-flex',
  alignItems: 'center',
  height: 48,
  px: '24px',
  borderRadius: '999px',
  fontSize: '14px',
  fontWeight: 500,
  textDecoration: 'none',
  transition: 'background 150ms, transform 150ms',
  '&:hover': { transform: 'translateY(-1px)' },
} as const;

// ----------------------------------------------------------------------

export const HeroHeader: React.FC<{ reading: LandingReading }> = ({ reading }) => (
  <Box
    component="section"
    sx={(th) => ({
      position: 'relative',
      overflow: 'hidden',
      px: '5%',
      py: { xs: 7, md: 9, lg: 11 },
      ...th.applyStyles('dark', { bgcolor: 'background.paper' }),
    })}
  >
    {/* Content */}
    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, px: 0 }}>
      <Stack alignItems="center">
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          {/* ---- Title ---- */}
          <Typography
            component="h1"
            sx={(th) => ({
              fontSize: 'clamp(40px, 5.6vw, 68px)',
              fontWeight: 500,
              letterSpacing: '-0.035em',
              lineHeight: 1.08,
              mb: '20px',
              color: 'var(--ink)',
              ...th.applyStyles('dark', { color: '#FFFFFF' }),
            })}
          >
            {COPY.hero.title}
          </Typography>

          {/* ---- Subline ---- */}
          <Typography
            sx={(th) => ({
              fontSize: { xs: '16px', md: '18px' },
              color: 'var(--muted)',
              lineHeight: 1.55,
              maxWidth: '58ch',
              mx: 'auto',
              mb: { xs: '32px', md: '40px' },
              ...th.applyStyles('dark', { color: 'var(--muted)' }),
            })}
          >
            {COPY.hero.subline}
          </Typography>

          {/* ---- Keel reading card ---- */}
          <Box sx={{ maxWidth: 480, width: '100%', mx: 'auto', mb: '28px' }}>
            <ReadingCard data={reading} />
          </Box>

          {/* ---- Buttons ---- */}
          <Box
            sx={{
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
                ...BUTTON_SX,
                bgcolor: 'var(--accent)',
                color: 'var(--on-brand)',
                '&:hover': { ...BUTTON_SX['&:hover'], bgcolor: 'var(--accent-strong)' },
              }}
            >
              {COPY.hero.primaryCta}
            </Box>
            <Box
              component="a"
              href={LINKS.howItWorks}
              sx={{
                ...BUTTON_SX,
                bgcolor: 'rgba(255,255,255,0.85)',
                color: 'var(--accent)',
                border: '1px solid var(--border-strong)',
                '&:hover': { ...BUTTON_SX['&:hover'], bgcolor: 'var(--surface)' },
              }}
            >
              {COPY.hero.secondaryCta}
            </Box>
          </Box>
        </Box>
      </Stack>
    </Container>
  </Box>
);

HeroHeader.displayName = 'HeroHeader';
