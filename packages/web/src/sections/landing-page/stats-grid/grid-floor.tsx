'use client';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

/** One grid cell, in px on the floor plane. */
const CELL = 44;

/**
 * Light streaks running along the floor's grid lines. `axis` is the line they ride,
 * `at` which line (in cells from the plane's top-left), `ms` one crossing, `delay` the
 * stagger. Decoration only: no data, no meaning.
 */
const STREAKS: readonly { axis: 'x' | 'y'; at: number; ms: number; delay: number }[] = [
  { axis: 'x', at: 3, ms: 4200, delay: 0 },
  { axis: 'x', at: 7, ms: 5600, delay: 1400 },
  { axis: 'x', at: 11, ms: 3800, delay: 2600 },
  { axis: 'y', at: 9, ms: 4800, delay: 800 },
  { axis: 'y', at: 17, ms: 5200, delay: 2200 },
  { axis: 'y', at: 24, ms: 4400, delay: 3400 },
];

export type GridFloorProps = {
  /** Off screen, hidden tab or reduced motion: the streaks hold still. */
  paused: boolean;
};

/**
 * A grid floor in perspective, fading out towards the card's top and left, with light
 * streaks that run along its lines. The streaks are the only thing that moves.
 */
export function GridFloor({ paused }: GridFloorProps) {
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        perspective: '420px',
        perspectiveOrigin: '50% 0%',
        WebkitMaskImage: 'radial-gradient(120% 90% at 75% 100%, black 35%, transparent 75%)',
        maskImage: 'radial-gradient(120% 90% at 75% 100%, black 35%, transparent 75%)',
        '@keyframes waysStreakX': {
          from: { transform: 'translateX(-30%)' },
          to: { transform: 'translateX(130%)' },
        },
        '@keyframes waysStreakY': {
          from: { transform: 'translateY(-30%)' },
          to: { transform: 'translateY(130%)' },
        },
        '& .streak': {
          animationPlayState: paused ? 'paused' : 'running',
        },
        '@media (prefers-reduced-motion: reduce)': {
          '& .streak': { animation: 'none', opacity: 0 },
        },
      }}
    >
      {/* The plane: wider than the card, tipped back from its bottom edge. */}
      <Box
        sx={{
          position: 'absolute',
          left: '-20%',
          right: '-20%',
          bottom: '-10%',
          height: '150%',
          transformOrigin: '50% 100%',
          transform: 'rotateX(62deg)',
          backgroundImage: [
            'linear-gradient(rgba(150,180,215,0.16) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(150,180,215,0.16) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: `${CELL}px ${CELL}px`,
        }}
      >
        {STREAKS.map((s) => (
          <Box
            key={`${s.axis}${s.at}`}
            sx={{
              position: 'absolute',
              ...(s.axis === 'x'
                ? { left: 0, right: 0, top: s.at * CELL, height: '1px' }
                : { top: 0, bottom: 0, left: s.at * CELL, width: '1px' }),
            }}
          >
            <Box
              className="streak"
              sx={{
                position: 'absolute',
                ...(s.axis === 'x'
                  ? {
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '1.5px',
                      background:
                        'linear-gradient(90deg, transparent 0%, transparent 70%, rgba(125,211,252,0.0) 70%, rgba(125,211,252,0.85) 84%, #e0f7ff 85%, transparent 85.5%)',
                    }
                  : {
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: '1.5px',
                      background:
                        'linear-gradient(180deg, transparent 0%, transparent 70%, rgba(165,180,252,0) 70%, rgba(165,180,252,0.85) 84%, #eef0ff 85%, transparent 85.5%)',
                    }),
                animation: `${s.axis === 'x' ? 'waysStreakX' : 'waysStreakY'} ${s.ms}ms linear ${s.delay}ms infinite both`,
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
