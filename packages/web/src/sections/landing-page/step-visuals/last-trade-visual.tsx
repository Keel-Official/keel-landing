'use client';

import Box from '@mui/material/Box';

import { usePlayOnce, STEP_VISUAL_COLORS as C } from './step-visual';

// ----------------------------------------------------------------------

const PAST_TRADES: readonly [number, number][] = [
  [16, 30],
  [40, 36],
  [64, 26],
  [88, 34],
  [112, 22],
  [136, 32],
  [160, 28],
];

const LAST = { x: 184, y: 24 };
const NEXT = { x: 220, y: 24 };
const BASELINE_Y = 44;
const LABEL_Y = 56;

/** Past dots fade in 60 ms apart, then the last trade settles: about 760 ms in all. */
const STAGGER_MS = 60;
const FADE_MS = 200;
const LAST_DELAY_MS = (PAST_TRADES.length - 1) * STAGGER_MS + FADE_MS;
const LAST_MS = 200;

const LABEL = {
  fontFamily: 'inherit',
  fontSize: 7.5,
  fontWeight: 500,
} as const;

/**
 * Step 1, "A price is only the last trade.": a row of past trades, the last one solid
 * and labelled, and an empty dashed circle for the trade that has not happened yet.
 * An illustration, not data: no numbers, no axes, no currency.
 *
 * The two labels sit 36 units apart, closer than "Last trade" is wide, so "Last trade"
 * ends at the dot's right edge instead of centring on it. The viewBox scales uniformly,
 * so this holds at every card width.
 */
export function LastTradeVisual() {
  const { ref, phase } = usePlayOnce<SVGSVGElement>();

  return (
    <Box
      component="svg"
      ref={ref}
      data-phase={phase}
      role="img"
      aria-label="A row of past trades. Only the last one sets the price. The next trade is not known yet."
      viewBox="0 0 240 64"
      preserveAspectRatio="xMidYMid meet"
      sx={{
        display: 'block',
        width: '100%',
        height: '100%',
        overflow: 'visible',
        '@keyframes stepPastIn': { from: { opacity: 0 }, to: { opacity: 0.35 } },
        '@keyframes stepLastIn': {
          from: { opacity: 0, transform: 'scale(0.6)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
        '& .past': { opacity: 0.35 },
        '& .last': { transformBox: 'fill-box', transformOrigin: 'center' },
        '&[data-phase="armed"] .past, &[data-phase="armed"] .last': { opacity: 0 },
        '&[data-phase="play"] .past': {
          animation: `stepPastIn ${FADE_MS}ms ease-out both`,
        },
        '&[data-phase="play"] .last': {
          animation: `stepLastIn ${LAST_MS}ms ease-out ${LAST_DELAY_MS}ms both`,
        },
      }}
    >
      <g aria-hidden="true">
        <line
          x1={0}
          y1={BASELINE_Y}
          x2={240}
          y2={BASELINE_Y}
          stroke={C.line}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />

        {PAST_TRADES.map(([x, y], index) => (
          <circle
            key={x}
            className="past"
            cx={x}
            cy={y}
            r={3}
            fill={C.muted}
            style={{ animationDelay: `${index * STAGGER_MS}ms` }}
          />
        ))}

        <circle className="last" cx={LAST.x} cy={LAST.y} r={5} fill={C.ink} />

        <circle
          cx={NEXT.x}
          cy={NEXT.y}
          r={5}
          fill="none"
          stroke={C.muted}
          strokeWidth={1.5}
          strokeDasharray="2.5 2"
          vectorEffect="non-scaling-stroke"
        />

        <text x={LAST.x + 5} y={LABEL_Y} textAnchor="end" fill={C.ink} style={LABEL}>
          Last trade
        </text>
        <text x={NEXT.x} y={LABEL_Y} textAnchor="middle" fill={C.muted} style={LABEL}>
          Next trade
        </text>
      </g>
    </Box>
  );
}
