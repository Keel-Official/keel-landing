'use client';

import type { DepthPanel } from '@/lib/keel/landing/story';

import { fill } from '@/lib/keel/format/fill';

import Box from '@mui/material/Box';

import { COPY } from '../../copy';
import { C, u, tr, MONO, EASE, Label, Scene, SPRING, FloatCard, DotCaption } from '../stage-kit';

import type { SceneProps } from '../stage-kit';

// ----------------------------------------------------------------------

const GROUND_Y = 196;
const DOT_Y = 104;
const BAR = { width: 12, pitch: 18, first: 30 } as const;

/** How far left of the price each rung's marker sits, by rung index (2%, 5%, 10%). */
const RUNG_OFFSET = [51, 105, 195] as const;
/** How many bars, nearest first, fall inside each rung. */
const RUNG_BARS = [2, 5, 10] as const;

/**
 * Bar heights, nearest the price first. Drawn by hand to sketch the saved sell-side
 * readings, not scaled in the browser: USTRY's offers sit almost all inside 2% and
 * stop there; XLM's are thinner but keep coming as the range widens.
 */
const SHAPES: Record<string, readonly number[]> = {
  USTRY: [88, 92, 3, 3, 2, 2, 2, 2, 2, 2],
  XLM: [17, 17, 10, 10, 10, 13, 13, 13, 13, 13],
};
const FALLBACK_SHAPE = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30] as const;

type Market = { panel: DepthPanel; x0: number; dotX: number };

function MarketDrawing({
  market,
  rung,
  instant,
}: {
  market: Market;
  rung: number;
  instant: boolean;
}) {
  const { panel, x0, dotX } = market;
  const shape = SHAPES[panel.code] ?? FALLBACK_SHAPE;
  const lit = rung >= 0 ? RUNG_BARS[rung] : 0;
  const offset = rung >= 0 ? RUNG_OFFSET[rung] : 0;

  return (
    <g>
      <text
        x={x0}
        y={56}
        fill={C.ink}
        style={{ fontFamily: 'inherit', fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}
      >
        {panel.code} / {panel.quote}
      </text>
      <line
        x1={x0}
        y1={GROUND_Y}
        x2={dotX + 12}
        y2={GROUND_Y}
        stroke={C.line}
        vectorEffect="non-scaling-stroke"
      />

      {shape.map((h, i) => (
        <rect
          key={i}
          x={dotX - BAR.first - i * BAR.pitch}
          y={GROUND_Y - h}
          width={BAR.width}
          height={h}
          rx={Math.min(4, h / 2)}
          style={{
            fill: i < lit ? 'var(--story-depth)' : C.soft,
            transition: tr(instant, 'fill 450ms ease'),
          }}
        />
      ))}

      <line
        x1={dotX}
        y1={DOT_Y + 9}
        x2={dotX}
        y2={GROUND_Y}
        stroke={C.price}
        strokeOpacity={0.55}
        strokeWidth={1.5}
      />
      <circle cx={dotX} cy={DOT_Y} r={7} fill={C.price} />

      {/* The range marker: slides left from the price as the range widens. */}
      <g
        style={{
          opacity: rung >= 0 ? 1 : 0,
          transform: `translateX(${-offset}px)`,
          transition: tr(instant, `transform 1000ms ${SPRING}, opacity 300ms ${EASE}`),
        }}
      >
        <line
          x1={dotX}
          y1={DOT_Y - 18}
          x2={dotX}
          y2={GROUND_Y}
          stroke={C.price}
          strokeWidth={1.5}
        />
        {panel.rungs.map((r, i) => (
          <Label
            key={r.label}
            x={dotX}
            y={DOT_Y - 24}
            ink
            style={{ opacity: i === rung ? 1 : 0, transition: tr(instant, 'opacity 250ms ease') }}
          >
            {r.label}
          </Label>
        ))}
      </g>
    </g>
  );
}

function FiguresCard({
  market,
  rung,
  show,
  instant,
}: {
  market: Market;
  rung: number;
  show: boolean;
  instant: boolean;
}) {
  const { panel, x0 } = market;
  const copy = COPY.story.stage;

  return (
    <FloatCard x={x0} y={GROUND_Y + 14} anchor="belowStart" show={show} instant={instant}>
      <Box sx={{ color: C.muted, fontSize: u(10.5), mb: u(5) }}>{copy.sellingAt}</Box>
      <Box
        component="dl"
        sx={{
          m: 0,
          display: 'grid',
          gridTemplateColumns: 'auto auto',
          columnGap: u(14),
          rowGap: u(3),
        }}
      >
        {panel.rungs.map((r, i) => {
          const on = i === rung;
          const style = {
            color: on ? C.ink : C.muted,
            fontWeight: on ? 600 : 400,
            transition: tr(instant, 'color 300ms ease'),
          };
          return (
            <Box key={r.label} sx={{ display: 'contents' }}>
              <Box component="dt" sx={{ ...MONO }} style={style}>
                {r.label}
              </Box>
              <Box
                component="dd"
                sx={{ ...MONO, m: 0, textAlign: 'right' }}
                style={style}
                title={r.exact ?? undefined}
              >
                {r.display ?? copy.unknown}
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box sx={{ color: C.muted, fontSize: u(9.5), mt: u(6) }}>
        {fill(copy.ledgerLine, { ledger: panel.ledgerSeq, methodology: panel.methodologyVersion })}
      </Box>
    </FloatCard>
  );
}

/**
 * Step 3, "Some markets are a slope. Some are a cliff.": two markets side by side,
 * deep first. A range marker widens through 2%, 5% and 10%, lighting the offers inside
 * it, while each market's card shows its saved sell-side figure at that rung.
 */
export function SceneDepth({
  beat,
  instant,
  depth,
}: SceneProps & { depth: readonly [DepthPanel, DepthPanel] }) {
  const copy = COPY.story;
  const markets: readonly Market[] = [
    { panel: depth[0], x0: 36, dotX: 250 },
    { panel: depth[1], x0: 300, dotX: 514 },
  ];
  // beat 1 to 3 open the 2%, 5% and 10% rungs.
  const rung = Math.min(beat, 3) - 1;
  const caption = beat >= 4;
  const thin = markets[1];
  const tipX = thin.dotX - RUNG_OFFSET[2];

  return (
    <Scene
      label={fill(copy.steps[2].dot, { range: '10%' })}
      svg={
        <>
          {markets.map((m) => (
            <MarketDrawing key={m.panel.code} market={m} rung={rung} instant={instant} />
          ))}
          <Label x={524} y={22} anchor="end" style={{ fontSize: 10 }}>
            {copy.stage.sketch}
          </Label>
        </>
      }
    >
      {markets.map((m) => (
        <FiguresCard key={m.panel.code} market={m} rung={rung} show={beat >= 1} instant={instant} />
      ))}

      <DotCaption x={tipX + 8} y={DOT_Y + 36} anchor="right" show={caption} instant={instant}>
        {fill(copy.steps[2].dot, { range: '10%' })}
      </DotCaption>
    </Scene>
  );
}
