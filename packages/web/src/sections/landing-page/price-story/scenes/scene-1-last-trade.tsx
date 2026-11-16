'use client';

import { useRef } from 'react';

import { COPY } from '../../copy';
import { TRAIL } from '../story-timeline';
import {
  C,
  tr,
  Label,
  Scene,
  BASE_Y,
  SPRING,
  reveal,
  travel,
  pointAt,
  Baseline,
  useSvgId,
  DotCaption,
  smoothPath,
  CalloutLeader,
  usePathSamples,
} from '../stage-kit';

import type { SceneProps } from '../stage-kit';

// ----------------------------------------------------------------------

const TRADES: readonly (readonly [number, number])[] = [
  [70, 205],
  [100, 222],
  [130, 190],
  [160, 214],
  [190, 180],
  [220, 208],
  [250, 196],
];
const LAST = [280, 160] as const;
const NEXT = [364, 160] as const;
const PATH = smoothPath([...TRADES, LAST]);

/**
 * Step 1, "A price is only the last trade.": a trail of earlier trades draws in, the
 * price dot rides it and lands on the last one, and an empty dashed circle waits where
 * the next trade will be. No numbers.
 */
export function SceneLastTrade({ beat, elapsed, instant }: SceneProps) {
  const copy = COPY.story;
  const svgId = useSvgId();
  const pathRef = useRef<SVGPathElement>(null);
  const samples = usePathSamples(pathRef);

  const q = travel(elapsed, TRAIL.startMs, TRAIL.durationMs);
  const [dotX, dotY] = pointAt(samples, q, LAST);
  const landed = beat >= 2;
  const caption = beat >= 4;

  return (
    <Scene
      label={copy.steps[0].dot}
      svg={
        <>
          <defs>
            <linearGradient id={`${svgId}-trail`} gradientUnits="userSpaceOnUse" x1="70" x2="280">
              <stop offset="0" style={{ stopColor: 'var(--story-depth)' }} />
              <stop offset="1" style={{ stopColor: 'var(--story-price)' }} />
            </linearGradient>
          </defs>

          <Baseline />

          <path
            ref={pathRef}
            d={PATH}
            pathLength={1}
            fill="none"
            stroke={`url(#${svgId}-trail)`}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="1"
            strokeDashoffset={1 - q}
          />

          {TRADES.map(([x, y], i) => {
            const on = q >= i / TRADES.length - 0.001 && beat >= 1;
            return (
              <circle
                key={x}
                cx={x}
                cy={y}
                r={4}
                fill={C.soft}
                style={{
                  opacity: on ? 1 : 0,
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                  transform: on ? 'scale(1)' : 'scale(0)',
                  transition: tr(instant, `opacity 300ms ease, transform 700ms ${SPRING}`),
                }}
              />
            );
          })}

          {/* The price stands on the baseline once it has landed. */}
          <line
            x1={LAST[0]}
            y1={LAST[1] + 9}
            x2={LAST[0]}
            y2={BASE_Y}
            stroke={C.price}
            strokeOpacity={0.55}
            strokeWidth={1.5}
            style={{
              transformBox: 'fill-box',
              transformOrigin: '50% 100%',
              transform: landed ? 'scaleY(1)' : 'scaleY(0)',
              transition: tr(instant, `transform 900ms ${SPRING}`),
            }}
          />

          {/* What comes next is not known: a dashed reach to an empty circle. */}
          <g style={reveal(beat >= 3, instant)}>
            <line
              x1={LAST[0] + 14}
              y1={LAST[1]}
              x2={NEXT[0] - 12}
              y2={NEXT[1]}
              stroke={C.muted}
              strokeWidth={1.5}
              strokeDasharray="2 5"
              strokeLinecap="round"
            />
            <circle
              cx={NEXT[0]}
              cy={NEXT[1]}
              r={9}
              fill="#fff"
              stroke={C.muted}
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
            <Label x={NEXT[0]}>{copy.stage.nextTrade}</Label>
          </g>

          <Label x={LAST[0]} ink style={reveal(landed, instant)}>
            {copy.stage.lastTrade}
          </Label>

          <CalloutLeader
            from={[LAST[0], LAST[1] - 12]}
            to={[LAST[0], LAST[1] - 34]}
            show={caption}
            instant={instant}
          />

          <circle cx={dotX} cy={dotY} r={9} fill={C.price} />
        </>
      }
    >
      <DotCaption x={LAST[0]} y={LAST[1] - 36} anchor="above" show={caption} instant={instant}>
        {copy.steps[0].dot}
      </DotCaption>
    </Scene>
  );
}
