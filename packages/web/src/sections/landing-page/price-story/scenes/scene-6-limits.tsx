'use client';

import Box from '@mui/material/Box';

import { COPY } from '../../copy';
import {
  C,
  u,
  tr,
  grow,
  Label,
  Scene,
  BASE_Y,
  reveal,
  SPRING,
  Baseline,
  useSvgId,
  FloatCard,
  DotCaption,
} from '../stage-kit';

import type { SceneProps } from '../stage-kit';

// ----------------------------------------------------------------------

/** Two limits. Heights are a shape: which one is lower changes per asset. */
const SELLING = { x: 50, width: 70, top: 106 } as const;
const MANIPULATION = { x: 170, width: 70, top: 186 } as const;
const SAFE_DOT = [MANIPULATION.x + MANIPULATION.width / 2, MANIPULATION.top] as const;

/**
 * Step 6, "Keel measures the market behind the price.": every 15 minutes Keel reads the
 * order books and pools, and works out two limits. The lower one is marked as the safe
 * collateral size. An illustration, not data.
 */
export function SceneLimits({ beat, instant }: SceneProps) {
  const copy = COPY.story;
  const svgId = useSvgId();
  const marked = beat >= 3;
  const caption = beat >= 4;

  return (
    <Scene
      label={copy.steps[5].dot}
      svg={
        <>
          <defs>
            <linearGradient id={`${svgId}-selling`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: 'var(--story-depth)' }} />
              <stop offset="1" style={{ stopColor: 'var(--story-depth)', stopOpacity: 0.35 }} />
            </linearGradient>
            <linearGradient id={`${svgId}-manip`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: 'var(--story-sell)' }} />
              <stop offset="1" style={{ stopColor: 'var(--story-sell)', stopOpacity: 0.35 }} />
            </linearGradient>
          </defs>

          <Baseline x1={36} x2={280} />

          <rect
            x={SELLING.x}
            y={SELLING.top}
            width={SELLING.width}
            height={BASE_Y - SELLING.top}
            rx={5}
            fill={`url(#${svgId}-selling)`}
            style={grow(beat >= 1, instant)}
          />
          <rect
            x={MANIPULATION.x}
            y={MANIPULATION.top}
            width={MANIPULATION.width}
            height={BASE_Y - MANIPULATION.top}
            rx={5}
            fill={`url(#${svgId}-manip)`}
            style={grow(beat >= 2, instant)}
          />
          <Label x={SELLING.x + SELLING.width / 2}>{copy.stage.sellingLimit}</Label>
          <Label x={MANIPULATION.x + MANIPULATION.width / 2}>{copy.stage.manipulationLimit}</Label>

          {/* The lower of the two, carried across as the safe collateral size. */}
          <line
            x1={36}
            y1={SAFE_DOT[1]}
            x2={262}
            y2={SAFE_DOT[1]}
            stroke={C.price}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            style={{
              transformBox: 'fill-box',
              transformOrigin: '100% 50%',
              transform: marked ? 'scaleX(1)' : 'scaleX(0)',
              transition: tr(instant, `transform 800ms ${SPRING}`),
            }}
          />
          <circle
            cx={SAFE_DOT[0]}
            cy={SAFE_DOT[1]}
            r={8}
            fill={C.price}
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              transform: marked ? 'scale(1)' : 'scale(0)',
              transition: tr(instant, `transform 600ms ${SPRING}`),
            }}
          />

          <Label
            x={524}
            y={350}
            anchor="end"
            style={{ fontSize: 10, ...reveal(beat >= 1, instant) }}
          >
            {copy.stage.illustration}
          </Label>
        </>
      }
    >
      <FloatCard x={524} y={86} anchor="left" show={beat >= 1} instant={instant}>
        <Box sx={{ color: C.muted, fontSize: u(10.5), mb: u(6) }}>{copy.stage.every15}</Box>
        <Box sx={{ display: 'grid', gap: u(5), fontWeight: 500 }}>
          {[copy.stage.orderBook, copy.stage.liquidityPools].map((source) => (
            <Box key={source} sx={{ display: 'flex', alignItems: 'center', gap: u(8) }}>
              <Box
                component="span"
                aria-hidden="true"
                sx={{ width: u(6), height: u(6), borderRadius: '50%', bgcolor: C.ink2 }}
              />
              {source}
            </Box>
          ))}
        </Box>
      </FloatCard>

      <DotCaption
        x={SAFE_DOT[0] + 18}
        y={SAFE_DOT[1]}
        anchor="right"
        show={caption}
        instant={instant}
      >
        {copy.steps[5].dot}
      </DotCaption>
    </Scene>
  );
}
