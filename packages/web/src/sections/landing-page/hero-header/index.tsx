'use client';

import type { LandingReading } from '@/lib/keel/landing/readings';

import * as React from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, Stack, Container, Typography } from '@mui/material';

import { COPY, LINKS } from '../copy';
import { ReadingCard } from './reading-card';
import { WavyBackground } from './wavy-background';

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

export const HeroHeader: React.FC<{ reading: LandingReading }> = ({ reading }) => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={(th) => ({
        position: 'relative',
        overflow: 'hidden',
        px: '5%',
        py: { xs: 7, md: 9, lg: 11 },
        bgcolor: '#FAFAFB',
        ...th.applyStyles('dark', { bgcolor: 'background.paper' }),
      })}
    >
      {/* Wavy canvas */}
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <WavyBackground
          sizing="viewport"
          baseline="center"
          yOffset={0}
          colors={['#38bdf8', '#818cf8', '#c084fc', '#e879f9', '#22d3ee']}
          waveOpacity={0.35}
          blur={36}
          saturate={115}
          canvasOpacity={0.85}
          speed="slow"
          backgroundFill={
            theme.palette.mode === 'dark' ? theme.palette.background.paper : '#FAFAFB'
          }
        />
      </Box>

      {/* Fade top */}
      <Box
        sx={(th) => ({
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '90px',
          background:
            th.palette.mode === 'dark'
              ? `linear-gradient(to bottom, ${th.palette.background.paper} 0%, transparent 100%)`
              : 'linear-gradient(to bottom, rgba(250,250,251,1) 0%, rgba(250,250,251,0) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        })}
      />

      {/* Fade bottom */}
      <Box
        sx={(th) => ({
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '140px',
          background:
            th.palette.mode === 'dark'
              ? `linear-gradient(to top, ${th.palette.background.paper} 0%, transparent 100%)`
              : 'linear-gradient(to top, rgba(250,250,251,1) 0%, rgba(250,250,251,0) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        })}
      />

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
                color: '#0A0A0F',
                ...th.applyStyles('dark', { color: '#FFFFFF' }),
              })}
            >
              {COPY.hero.title}
            </Typography>

            {/* ---- Subline ---- */}
            <Typography
              sx={(th) => ({
                fontSize: { xs: '16px', md: '18px' },
                color: '#6B6B76',
                lineHeight: 1.55,
                maxWidth: '58ch',
                mx: 'auto',
                mb: { xs: '32px', md: '40px' },
                ...th.applyStyles('dark', { color: '#9A9AA3' }),
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
                  bgcolor: '#0A0A0F',
                  color: '#fff',
                  '&:hover': { ...BUTTON_SX['&:hover'], bgcolor: '#2A2A33' },
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
                  color: '#0A0A0F',
                  border: '1px solid rgba(10,10,15,0.12)',
                  '&:hover': { ...BUTTON_SX['&:hover'], bgcolor: '#fff' },
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
};

HeroHeader.displayName = 'HeroHeader';
