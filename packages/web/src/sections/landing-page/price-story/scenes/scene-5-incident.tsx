'use client';

import { useRef } from 'react';

import Box from '@mui/material/Box';

import { COPY } from '../../copy';
import { CLIMB } from '../story-timeline';
import {
  C,
  u,
  tr,
  Label,
  Scene,
  BASE_Y,
  travel,
  pointAt,
  useSvgId,
  FloatCard,
  DotCaption,
  CalloutLeader,
  usePathSamples,
} from '../stage-kit';

import type { SceneProps } from '../stage-kit';

// ----------------------------------------------------------------------

/** The three rungs of the climb: the price, ten times it, a hundred times it. */
const RUNGS = [
  { y: BASE_Y, label: '1×' },
  { y: 216, label: '10×' },
  { y: 136, label: '100×' },
] as const;

const START = [110, BASE_Y] as const;
const TOP = [450, 136] as const;
const PATH = `M${START[0]},${START[1]} L250,${BASE_Y} C300,${BASE_Y} 318,${BASE_Y - 10} 335,${BASE_Y - 55} C352,${BASE_Y - 105} 372,${TOP[1]} ${TOP[0]},${TOP[1]}`;

/** The dot shifts from the price colour towards the pushed colour as it climbs. */
function dotColour(y: number) {
  if (y > BASE_Y - 10) return 'var(--story-price)';
  if (y > RUNGS[1].y + 1) return 'var(--story-sell)';
  return 'var(--story-pushed)';
}

/**
 * Step 5, "It happened on Stellar.": on 22 February 2026 USTRY was pushed to roughly a
 * hundred times its price. The price dot climbs a 1×, 10×, 100× ladder; no ledger and
 * no incident figure until they are confirmed.
 */
export function SceneIncident({ beat, elapsed, instant }: SceneProps) {
  const copy = COPY.story;
  const svgId = useSvgId();
  const pathRef = useRef<SVGPathElement>(null);
  const samples = usePathSamples(pathRef);

  const q = travel(elapsed, CLIMB.startMs, CLIMB.durationMs);
  const [x, y] = pointAt(samples, q, beat >= 2 ? TOP : START);
  const caption = beat >= 3;
  const topped = beat >= 2;

  return (
    <Scene
      label={copy.steps[4].dot}
      svg={
        <>
          <defs>
            <linearGradient id={`${svgId}-climb`} gradientUnits="userSpaceOnUse" x1="110" x2="450">
              <stop offset="0" style={{ stopColor: 'var(--story-price)' }} />
              <stop offset="0.45" style={{ stopColor: 'var(--story-price)' }} />
              <stop offset="0.75" style={{ stopColor: 'var(--story-sell)' }} />
              <stop offset="1" style={{ stopColor: 'var(--story-pushed)' }} />
            </linearGradient>
          </defs>

          {RUNGS.map((rung, i) => {
            const passed = q > 0 && y <= rung.y + (i === 0 ? 0 : 1);
            return (
              <g key={rung.label}>
                <line
                  x1={110}
                  y1={rung.y}
                  x2={470}
                  y2={rung.y}
                  stroke={C.line}
                  strokeDasharray={i === 0 ? undefined : '2 5'}
                  vectorEffect="non-scaling-stroke"
                />
                <Label
                  x={92}
                  y={rung.y + 4}
                  anchor="end"
                  style={{
                    fill: passed || (i === 0 && beat >= 1) ? C.ink : C.muted,
                    fontWeight: passed ? 700 : 500,
                    transition: tr(instant, 'fill 300ms ease'),
                  }}
                >
                  {rung.label}
                </Label>
              </g>
            );
          })}

          <path
            d={PATH}
            fill="none"
            stroke={C.soft}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.55}
          />
          <path
            ref={pathRef}
            d={PATH}
            pathLength={1}
            fill="none"
            stroke={`url(#${svgId}-climb)`}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="1"
            strokeDashoffset={1 - q}
          />

          <CalloutLeader
            from={[TOP[0] - 6, TOP[1] - 10]}
            to={[TOP[0] - 30, TOP[1] - 30]}
            show={caption}
            instant={instant}
          />

          {topped && !instant ? (
            <circle
              cx={TOP[0]}
              cy={TOP[1]}
              r={9}
              fill="none"
              stroke="var(--story-pushed)"
              strokeWidth={1.5}
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
                animation: 'psPing 1s ease-out 1 both',
              }}
            />
          ) : null}
          <circle
            cx={x}
            cy={y}
            r={9}
            style={{ fill: dotColour(y), transition: tr(instant, 'fill 300ms ease') }}
          />
        </>
      }
    >
      <FloatCard x={36} y={30} anchor="belowStart" show={beat >= 1} instant={instant}>
        <Box sx={{ color: C.muted, fontSize: u(10.5), mb: u(6) }}>{copy.stage.incidentDate}</Box>
        <Box sx={{ display: 'flex', gap: u(6), fontWeight: 600 }}>
          {[copy.stage.incidentAsset, copy.stage.incidentVenue].map((chip) => (
            <Box
              key={chip}
              component="span"
              sx={{ px: u(8), py: u(3), borderRadius: u(6), bgcolor: 'rgba(10,10,15,0.05)' }}
            >
              {chip}
            </Box>
          ))}
        </Box>
      </FloatCard>

      <DotCaption
        x={TOP[0] - 70}
        y={TOP[1] - 32}
        anchor="above"
        show={caption}
        instant={instant}
        color="var(--story-pushed)"
      >
        {copy.steps[4].dot}
      </DotCaption>
    </Scene>
  );
}
