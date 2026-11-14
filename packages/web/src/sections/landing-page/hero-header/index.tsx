'use client';

import * as React from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, Stack, Container } from '@mui/material';

import { WavyBackground } from './wavy-background';

// ----------------------------------------------------------------------

export const HeroHeader: React.FC = () => {
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
          <Box sx={{ textAlign: 'center', width: '100%' }} />
        </Stack>
      </Container>
    </Box>
  );
};

HeroHeader.displayName = 'HeroHeader';
