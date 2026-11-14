'use client';

import Box from '@mui/material/Box';

import { usePlayOnce, STEP_VISUAL_COLORS as C } from './step-visual';

// ----------------------------------------------------------------------

const BASELINE_Y = 44;
const LABEL_Y = 56;
const PRICE = { x: 120, y: 24 };

/** One offer: a small block. Columns of them stand on the baseline. */
const BLOCK = { width: 7, height: 3.5, gap: 1 };
const PITCH = 11;

/**
 * Blocks per column, nearest the price first. The stacks grow away from the price on
 * both sides, so more offers stand between the price and any move. An illustration,
 * not data: the counts are a shape, not a measurement.
 */
const STACKS = [1, 2, 2, 3, 4, 4, 5, 6] as const;

/** Columns rise from the centre outward, each one bottom block first. */
const COLUMN_STAGGER_MS = 30;
const LEVEL_STAGGER_MS = 60;
const FADE_MS = 200;

type Block = { x: number; y: number; delay: number };

function side(direction: -1 | 1): Block[] {
  const nearest = PRICE.x + direction * 14;
  return STACKS.flatMap((count, column) =>
    Array.from({ length: count }, (_, level) => ({
      x: nearest + direction * column * PITCH - BLOCK.width / 2,
      y: BASELINE_Y - (level + 1) * (BLOCK.height + BLOCK.gap),
      delay: column * COLUMN_STAGGER_MS + level * LEVEL_STAGGER_MS,
    }))
  );
}

const BLOCKS = [...side(-1), ...side(1)];

/** The middle of each side's columns, for its label. */
const BUY_LABEL_X = PRICE.x - 14 - ((STACKS.length - 1) * PITCH) / 2;
const SELL_LABEL_X = PRICE.x + 14 + ((STACKS.length - 1) * PITCH) / 2;

const LABEL = {
  fontFamily: 'inherit',
  fontSize: 7.5,
  fontWeight: 500,
} as const;

/**
 * Step 2, "What matters is what stands behind it.": the price as a solid dot on a
 * hairline, with open offers to buy on its left and offers to sell on its right,
 * stacking up as they get further from it.
 *
 * Built on the same pieces as step 1: `usePlayOnce` for the one-time entrance, the
 * shared colours, the 240 by 64 viewBox, the baseline at y = 44 and labels at y = 56.
 * About 830 ms in all; opacity and transform only.
 */
export function OffersVisual() {
  const { ref, phase } = usePlayOnce<SVGSVGElement>();

  return (
    <Box
      component="svg"
      ref={ref}
      data-phase={phase}
      role="img"
      aria-label="The price, with open offers to buy on one side and offers to sell on the other. The more offers stand behind it, the harder the price is to move."
      viewBox="0 0 240 64"
      preserveAspectRatio="xMidYMid meet"
      sx={{
        display: 'block',
        width: '100%',
        height: '100%',
        overflow: 'visible',
        '@keyframes stepOfferIn': {
          from: { opacity: 0, transform: 'translateY(3px)' },
          to: { opacity: 0.35, transform: 'translateY(0)' },
        },
        '& .offer': { opacity: 0.35, transformBox: 'fill-box' },
        '&[data-phase="armed"] .offer': { opacity: 0 },
        '&[data-phase="play"] .offer': {
          animation: `stepOfferIn ${FADE_MS}ms ease-out both`,
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

        {BLOCKS.map((block) => (
          <rect
            key={`${block.x}-${block.y}`}
            className="offer"
            x={block.x}
            y={block.y}
            width={BLOCK.width}
            height={BLOCK.height}
            rx={1}
            fill={C.muted}
            style={{ animationDelay: `${block.delay}ms` }}
          />
        ))}

        {/* The price: a hairline down to the baseline, and the dot it reads from. */}
        <line
          x1={PRICE.x}
          y1={PRICE.y}
          x2={PRICE.x}
          y2={BASELINE_Y}
          stroke={C.line}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        <circle cx={PRICE.x} cy={PRICE.y} r={5} fill={C.ink} />

        <text x={BUY_LABEL_X} y={LABEL_Y} textAnchor="middle" fill={C.muted} style={LABEL}>
          Offers to buy
        </text>
        <text x={PRICE.x} y={LABEL_Y} textAnchor="middle" fill={C.ink} style={LABEL}>
          Price
        </text>
        <text x={SELL_LABEL_X} y={LABEL_Y} textAnchor="middle" fill={C.muted} style={LABEL}>
          Offers to sell
        </text>
      </g>
    </Box>
  );
}
