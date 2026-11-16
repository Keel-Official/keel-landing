'use client';

import type { CSSProperties } from 'react';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

/**
 * One wash of light. It sits at `at` (% of the window), drifts along its own path, and
 * fades between two colours of the hero palette. Each wash has its own durations, so
 * the whole never repeats in an obvious beat.
 */
type Wash = {
  readonly at: readonly [number, number];
  /** Diameter, in vw. */
  readonly size: number;
  readonly from: string;
  readonly to: string;
  /** How far it drifts, in % of its own size, across and down. */
  readonly drift: readonly [number, number];
  readonly driftS: number;
  readonly fadeS: number;
  readonly opacity: number;
};

const WASHES: readonly Wash[] = [
  {
    at: [4, 40],
    size: 42,
    from: 'var(--hero-violet)',
    to: 'var(--hero-sky)',
    drift: [36, -28],
    driftS: 12,
    fadeS: 7,
    opacity: 0.69,
  },
  {
    at: [16, 22],
    size: 30,
    from: 'var(--hero-sky)',
    to: 'var(--hero-teal)',
    drift: [-32, 40],
    driftS: 9,
    fadeS: 8,
    opacity: 0.56,
  },
  {
    at: [8, 88],
    size: 30,
    from: 'var(--hero-sun)',
    to: 'var(--hero-mint)',
    drift: [44, -24],
    driftS: 11,
    fadeS: 6,
    opacity: 0.5,
  },
  {
    at: [26, 100],
    size: 30,
    from: 'var(--hero-mint)',
    to: 'var(--hero-sky)',
    drift: [-28, -36],
    driftS: 14,
    fadeS: 10,
    opacity: 0.53,
  },
  {
    at: [96, 54],
    size: 42,
    from: 'var(--hero-plum)',
    to: 'var(--hero-violet)',
    drift: [-40, 32],
    driftS: 13,
    fadeS: 8,
    opacity: 0.45,
  },
  {
    at: [88, 82],
    size: 34,
    from: 'var(--accent)',
    to: 'var(--hero-teal)',
    drift: [32, -32],
    driftS: 10,
    fadeS: 6,
    opacity: 0.4,
  },
  {
    at: [92, 10],
    size: 30,
    from: 'var(--hero-sky)',
    to: 'var(--hero-mint)',
    drift: [-36, 44],
    driftS: 14,
    fadeS: 9,
    opacity: 0.47,
  },
  {
    at: [72, 100],
    size: 28,
    from: 'var(--hero-teal)',
    to: 'var(--hero-sun)',
    drift: [40, -28],
    driftS: 8,
    fadeS: 8,
    opacity: 0.45,
  },
];

/**
 * The page's backdrop: soft light at the edges that drifts and changes colour, the
 * middle kept clear for the content (after the reference Al shared; animated, then put
 * behind every light section at Al's request, 16 November 2026). It is fixed to the
 * window, so it stays in view as the page scrolls; the ink panels (closing section,
 * footer) cover it. Only transform and opacity move, so the blur is drawn once and the
 * browser just slides and fades it.
 *
 * It keeps moving, like the price story and "Three ways in", and stops while the tab
 * is hidden. With reduced motion it is still. Decoration only: never data, never a
 * band colour.
 */
export function GradientBackdrop() {
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const apply = () => setRunning(!document.hidden);
    apply();
    document.addEventListener('visibilitychange', apply);
    return () => document.removeEventListener('visibilitychange', apply);
  }, []);

  return (
    <Box
      aria-hidden="true"
      sx={{
        // Behind the whole page, and still while it scrolls.
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none',
        '& .wash, & .wash-to': { animationPlayState: running ? 'running' : 'paused' },
        '@keyframes heroDrift': {
          '0%': { transform: 'translate(-50%, -50%) translate(0, 0) scale(1)' },
          '50%': {
            transform: 'translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(1.12)',
          },
          '100%': {
            transform:
              'translate(-50%, -50%) translate(calc(var(--dx) * -0.6), calc(var(--dy) * 0.8)) scale(0.94)',
          },
        },
        '@keyframes heroFade': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        '@media (prefers-reduced-motion: reduce)': {
          '& .wash, & .wash-to': { animation: 'none' },
        },
      }}
    >
      {WASHES.map((wash) => (
        <Box
          key={`${wash.at[0]}-${wash.at[1]}`}
          className="wash"
          sx={{
            position: 'absolute',
            left: `${wash.at[0]}%`,
            top: `${wash.at[1]}%`,
            width: `${wash.size}vw`,
            height: `${wash.size}vw`,
            transform: 'translate(-50%, -50%)',
            opacity: wash.opacity,
            filter: 'blur(64px)',
            willChange: 'transform',
            animation: `heroDrift ${wash.driftS}s ease-in-out infinite alternate`,
          }}
          style={{ '--dx': `${wash.drift[0]}%`, '--dy': `${wash.drift[1]}%` } as CSSProperties}
        >
          {/* Two colours on one wash; the second fades in and out over the first. */}
          <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', bgcolor: wash.from }} />
          <Box
            className="wash-to"
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              bgcolor: wash.to,
              opacity: 0,
              animation: `heroFade ${wash.fadeS}s ease-in-out infinite alternate`,
            }}
          />
        </Box>
      ))}

      {/* The clear middle, over the washes, so the content always stands on calm. */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(34% 40% at 50% 42%, var(--bg) 0%, color-mix(in srgb, var(--bg) 72%, transparent) 50%, transparent 80%)',
        }}
      />
    </Box>
  );
}
