import type { ReactNode } from 'react';

import { STORED_ICONS } from '@/lib/keel/assets/icons';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

/** Half the page's content width, plus a little air: logos stay outside it. */
const CONTENT_HALF = 620;
/** Logos show only where the window leaves room beside the content for the largest one. */
const ROOM = '@media (min-width: 1440px)';
/** Logo sizes, in px. */
const SIZE = { min: 40, max: 64 } as const;
/** Logos per side of a section. */
const PER_SIDE = { min: 2, max: 4 } as const;
/** The least vertical distance between two logos on one side, in % of the section. */
const MIN_GAP = 16;
/** Air kept between a logo and the window edge or the content. */
const EDGE = 8;

/** A small seeded generator, so a section's logos land in the same places every render. */
function seeded(seed: string) {
  const M = 2147483647;
  let state = 1;
  for (let i = 0; i < seed.length; i += 1) state = (state * 31 + seed.charCodeAt(i)) % M;
  if (state === 0) state = 1;
  // Park-Miller: plain arithmetic, the same sequence on the server and in the browser.
  return () => {
    state = (state * 16807) % M;
    return (state - 1) / (M - 1);
  };
}

type Side = 'left' | 'right';

type Spot = {
  src: string;
  side: Side;
  /** 0 to 1 across the margin: 0 at the window edge, 1 against the content. */
  across: number;
  /** % from the section's top. */
  top: number;
  size: number;
  /** Degrees. */
  tilt: number;
};

/** Tops for one side: anywhere down the section, no two closer than `MIN_GAP`. */
function topsFor(rand: () => number, count: number) {
  const tops: number[] = [];
  for (let tries = 0; tops.length < count && tries < 60; tries += 1) {
    const top = 4 + rand() * 86;
    if (tops.every((t) => Math.abs(t - top) >= MIN_GAP)) tops.push(top);
  }
  return tops;
}

/** Picks this section's logos and scatters them over the two side margins. */
function spotsFor(seed: string): Spot[] {
  const rand = seeded(seed);
  const pool = [...STORED_ICONS];
  // Shuffle, then take from the front: each section shows its own handful.
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const count = () => PER_SIDE.min + Math.floor(rand() * (PER_SIDE.max - PER_SIDE.min + 1));
  const sides: [Side, number][] = [
    ['left', count()],
    ['right', count()],
  ];

  let next = 0;
  return sides.flatMap(([side, n]) =>
    topsFor(rand, n).map((top) => {
      next += 1;
      return {
        src: pool[next - 1].src,
        side,
        top,
        across: rand(),
        size: SIZE.min + Math.round(rand() * (SIZE.max - SIZE.min)),
        tilt: Math.round((rand() - 0.5) * 28),
      };
    })
  );
}

/** Distance from the window edge: somewhere in the margin, never into the content. */
const fromEdge = (spot: Spot) =>
  `calc((50% - ${CONTENT_HALF}px - ${spot.size}px - ${EDGE * 2}px) * ${spot.across.toFixed(3)} + ${EDGE}px)`;

export type AssetScatterProps = {
  /** Names the section; different seeds give different logos and places. */
  seed: string;
  children: ReactNode;
};

/**
 * Wraps a landing section and scatters a few of the stored asset logos in the empty
 * margins beside its content. Decoration only: hidden from assistive tech, not
 * clickable, never over the content, and absent where the window has no margin to spare.
 */
export function AssetScatter({ seed, children }: AssetScatterProps) {
  const spots = spotsFor(seed);

  return (
    <Box sx={{ position: 'relative' }}>
      {children}
      <Box
        aria-hidden="true"
        sx={{
          display: 'none',
          [ROOM]: { display: 'block' },
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {spots.map((spot) => (
          <Box
            key={spot.src}
            component="img"
            src={spot.src}
            alt=""
            loading="lazy"
            sx={{
              position: 'absolute',
              top: `${spot.top.toFixed(2)}%`,
              [spot.side]: fromEdge(spot),
              width: spot.size,
              height: spot.size,
              objectFit: 'contain',
              borderRadius: '50%',
              bgcolor: 'var(--surface)',
              p: '4px',
              boxShadow: '0 1px 2px rgba(15,26,36,0.06), 0 8px 20px -10px rgba(15,26,36,0.3)',
              transform: `rotate(${spot.tilt}deg)`,
              opacity: 0.6,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
