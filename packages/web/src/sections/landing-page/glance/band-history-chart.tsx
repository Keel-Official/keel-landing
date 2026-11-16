'use client';

import type { KeyboardEvent } from 'react';
import type { Band } from '@/lib/keel/format/flags';
import type { BandReading } from '@/lib/keel/landing/glance';
import type { BandChart } from '@/lib/keel/landing/glance-chart';

import { useState } from 'react';
import { fill } from '@/lib/keel/format/fill';
import { formatDay } from '@/lib/keel/format/staleness';
import { bandLevel } from '@/lib/keel/landing/glance-chart';
import { BAND_ORDER, BAND_TOKENS } from '@/lib/keel/design/tokens';

import Box from '@mui/material/Box';

import { BandIcon } from '@/components/keel/band-word';

import { COPY } from '../copy';

// ----------------------------------------------------------------------

/** The plot's own coordinate box; fractions from `bandChart` are scaled by it. */
const V = 1000;
const DRAW_MS = 1600;
const CLEAR_MS = 450;
const INK = 'var(--ink)';
const MUTED = 'var(--muted)';
const LINE = 'var(--border)';
const MONO = { fontFamily: '"Geist Mono", ui-monospace, monospace' } as const;

const pct = (f: number) => `${(f * 100).toFixed(3)}%`;

/** The band's own colours in diagonal stripes: the mark of a partial-confidence reading. */
export function partialHatch(band: Band) {
  const token = BAND_TOKENS[band];
  return `repeating-linear-gradient(135deg, ${token.mark} 0 2px, ${token.surface} 2px 4px)`;
}

const visuallyHidden = {
  position: 'absolute',
  // In MUI `sx` a bare 1 means 100%; this must be one pixel.
  width: '1px',
  height: '1px',
  m: '-1px',
  p: 0,
  border: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const;

function confidenceOf(reading: BandReading) {
  return reading.confidence ?? COPY.glance.unknown;
}

export type BandHistoryChartProps = {
  readonly code: string;
  readonly chart: BandChart;
  /** True draws the line in, left to right; false clears it. The caller loops it. */
  readonly drawn: boolean;
  /** Reduced motion: final state, no movement. */
  readonly reduced: boolean;
};

/**
 * Chart A: the asset's band at each recorded reading, as a step line on four ordinal
 * levels. Each held stretch is drawn in its band's token, the same colour as the badge
 * and the axis tick; a reported gap is left empty; a change of methodology version is
 * a thin labelled rule. Hover, or focus and the arrow keys, step through the readings.
 * A visually hidden table carries the same readings, from the API values only.
 *
 * Pure in its data: no fetch, no clock, no timer. The only state is which reading the
 * reader is looking at.
 */
export function BandHistoryChart({ code, chart, drawn, reduced }: BandHistoryChartProps) {
  const copy = COPY.glance;
  const [active, setActive] = useState<number | null>(null);
  const last = chart.points.length - 1;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (event.key === 'Home') setActive(0);
    else if (event.key === 'End') setActive(last);
    else if (step === undefined) return;
    else setActive((a) => Math.min(last, Math.max(0, (a ?? (step > 0 ? -1 : last + 1)) + step)));
    event.preventDefault();
  };

  const onPointer = (clientX: number, box: DOMRect) => {
    const f = (clientX - box.left) / box.width;
    let best = 0;
    chart.points.forEach((p, i) => {
      if (Math.abs(p.x - f) < Math.abs(chart.points[best].x - f)) best = i;
    });
    setActive(best);
  };

  const shown = active === null ? null : chart.points[active];
  const motion = (value: string) => (reduced ? 'none' : value);

  return (
    <Box component="figure" sx={{ m: 0 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '84px 1fr', sm: '104px 1fr' },
          columnGap: '12px',
        }}
      >
        {/* y axis: the four bands, LOW at the bottom, each in its own icon, word and colour. */}
        <Box aria-hidden="true" sx={{ position: 'relative', height: { xs: 200, md: 240 } }}>
          {BAND_ORDER.map((band) => (
            <Box
              key={band}
              sx={{
                position: 'absolute',
                right: 0,
                top: pct(bandLevel(band)),
                transform: 'translateY(-50%)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: { xs: 11, sm: 12 },
                fontWeight: 600,
                color: BAND_TOKENS[band].ink,
              }}
            >
              <BandIcon icon={BAND_TOKENS[band].icon} size={13} />
              {band}
            </Box>
          ))}
        </Box>

        {/* The plot. One tab stop; the arrow keys move between readings. */}
        <Box
          role="group"
          tabIndex={0}
          aria-label={fill(copy.chartLabel, { code })}
          aria-describedby="glance-chart-table"
          onKeyDown={onKeyDown}
          onFocus={() => setActive((a) => a ?? last)}
          onBlur={() => setActive(null)}
          onMouseMove={(e) => onPointer(e.clientX, e.currentTarget.getBoundingClientRect())}
          onMouseLeave={() => setActive(null)}
          sx={{
            position: 'relative',
            height: { xs: 200, md: 240 },
            outline: 'none',
            borderRadius: '6px',
            '&:focus-visible': { boxShadow: '0 0 0 2px var(--accent)' },
          }}
        >
          <Box
            component="svg"
            aria-hidden="true"
            viewBox={`0 0 ${V} ${V}`}
            preserveAspectRatio="none"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              overflow: 'visible',
            }}
          >
            <defs>
              <clipPath id="glance-reveal">
                <rect
                  x={0}
                  y={-50}
                  width={V}
                  height={V + 100}
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: '0 50%',
                    transform: drawn ? 'scaleX(1)' : 'scaleX(0)',
                    // Draws in over 1.6 s; clears faster, so the loop's pause stays short.
                    transition: motion(
                      drawn
                        ? `transform ${DRAW_MS}ms ease-in-out`
                        : `transform ${CLEAR_MS}ms ease-in`
                    ),
                  }}
                />
              </clipPath>
            </defs>

            {/* A gridline at each band's level. */}
            {BAND_ORDER.map((band) => (
              <line
                key={band}
                x1={0}
                x2={V}
                y1={bandLevel(band) * V}
                y2={bandLevel(band) * V}
                stroke={LINE}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Reported gaps: a quiet field, nothing drawn across it. */}
            {chart.gaps.map((gap) => (
              <rect
                key={`${gap.x1}`}
                x={gap.x1 * V}
                y={0}
                width={(gap.x2 - gap.x1) * V}
                height={V}
                fill="var(--surface-2)"
              />
            ))}

            <g clipPath="url(#glance-reveal)">
              {chart.risers.map((r) => (
                <line
                  key={`r${r.x}`}
                  x1={r.x * V}
                  x2={r.x * V}
                  y1={r.y1 * V}
                  y2={r.y2 * V}
                  stroke={MUTED}
                  strokeOpacity={0.5}
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {chart.runs.map((run) => (
                <line
                  key={`h${run.x1}`}
                  x1={run.x1 * V}
                  x2={run.x2 * V}
                  y1={run.y * V}
                  y2={run.y * V}
                  stroke={BAND_TOKENS[run.band].mark}
                  strokeWidth={3}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>

            {chart.rules.map((rule) => (
              <line
                key={`m${rule.x}`}
                x1={rule.x * V}
                x2={rule.x * V}
                y1={0}
                y2={V}
                stroke={INK}
                strokeOpacity={0.5}
                strokeWidth={1}
                strokeDasharray="3 3"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </Box>

          {/* Labels for gaps and methodology changes, in HTML so the text keeps its shape. */}
          {chart.gaps.map((gap) => (
            <Box
              key={`gl${gap.x1}`}
              aria-hidden="true"
              sx={{
                position: 'absolute',
                top: 4,
                left: pct((gap.x1 + gap.x2) / 2),
                transform: 'translateX(-50%)',
                fontSize: 10.5,
                color: MUTED,
                whiteSpace: 'nowrap',
                // Too wide for a phone's gap field; the empty field says it there.
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {copy.noRecording}
            </Box>
          ))}
          {chart.rules.map((rule) => (
            <Box
              key={`ml${rule.x}`}
              aria-hidden="true"
              sx={{
                position: 'absolute',
                top: 4,
                left: pct(rule.x),
                ml: '4px',
                fontSize: 10.5,
                color: INK,
                ...MONO,
              }}
            >
              {fill(copy.methodologyChange, { methodology: rule.version })}
            </Box>
          ))}

          {/* The readings. The current one is larger, hatched when its confidence is partial. */}
          {chart.points.map((p, i) => {
            const token = BAND_TOKENS[p.reading.band];
            const big = p.reading.current;
            const size = big ? 14 : i === active ? 10 : 6;
            return (
              <Box
                key={p.reading.ledgerSeq}
                aria-hidden="true"
                sx={{
                  position: 'absolute',
                  left: pct(p.x),
                  top: pct(p.y),
                  width: size,
                  height: size,
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  background:
                    p.reading.confidence === 'partial' ? partialHatch(p.reading.band) : token.mark,
                  border: big ? `2px solid ${token.mark}` : 'none',
                  boxShadow:
                    i === active ? `0 0 0 3px var(--surface), 0 0 0 4px ${token.mark}` : 'none',
                }}
                style={{
                  opacity: drawn ? 1 : 0,
                  transition: motion(
                    drawn
                      ? `opacity 200ms ease ${Math.round(p.x * DRAW_MS)}ms`
                      : `opacity ${CLEAR_MS}ms ease`
                  ),
                }}
              />
            );
          })}

          {/* The reading under the pointer or the focus. */}
          {shown ? (
            <Box
              aria-hidden="true"
              sx={{
                position: 'absolute',
                zIndex: 2,
                left: pct(shown.x),
                top: pct(shown.y),
                transform: `translate(${shown.x > 0.6 ? 'calc(-100% - 12px)' : '12px'}, -50%)`,
                bgcolor: 'var(--surface)',
                border: `1px solid ${LINE}`,
                borderRadius: '10px',
                boxShadow: '0 8px 24px -12px rgba(15,26,36,0.35)',
                px: '12px',
                py: '9px',
                fontSize: 12.5,
                lineHeight: 1.5,
                color: INK,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontWeight: 600,
                  color: BAND_TOKENS[shown.reading.band].ink,
                }}
              >
                <BandIcon icon={BAND_TOKENS[shown.reading.band].icon} size={13} />
                {shown.reading.band}
              </Box>
              <Box>{formatDay(shown.reading.at)}</Box>
              <Box sx={{ ...MONO, color: MUTED, fontSize: 11.5 }}>
                {fill(copy.ledger, { ledger: shown.reading.ledgerSeq })}
                <br />
                {fill(copy.methodology, { methodology: shown.reading.methodologyVersion })}
                <br />
                {fill(copy.confidence, { confidence: confidenceOf(shown.reading) })}
              </Box>
              {shown.reading.priceSource === 'none' ? <Box>{copy.noPrice}</Box> : null}
            </Box>
          ) : null}

          {/* Announces the reading the keyboard moved to. */}
          <Box aria-live="polite" sx={visuallyHidden}>
            {shown
              ? `${shown.reading.band}, ${formatDay(shown.reading.at)}, ${fill(copy.ledger, {
                  ledger: shown.reading.ledgerSeq,
                })}, ${fill(copy.methodology, {
                  methodology: shown.reading.methodologyVersion,
                })}, ${fill(copy.confidence, { confidence: confidenceOf(shown.reading) })}`
              : ''}
          </Box>
        </Box>

        {/* x axis: dates of real readings, first and last at the ends. */}
        <Box />
        <Box aria-hidden="true" sx={{ position: 'relative', height: 28, mt: '8px' }}>
          {chart.ticks.map((tick, i) => (
            <Box
              key={tick.at}
              sx={{
                position: 'absolute',
                left: pct(tick.x),
                transform:
                  i === 0
                    ? 'none'
                    : i === chart.ticks.length - 1
                      ? 'translateX(-100%)'
                      : 'translateX(-50%)',
                fontSize: 11.5,
                color: MUTED,
                whiteSpace: 'nowrap',
                // Only the ends on a narrow screen, so dates never overlap.
                display: {
                  xs: i === 0 || i === chart.ticks.length - 1 ? 'block' : 'none',
                  sm: 'block',
                },
              }}
            >
              {formatDay(tick.at)}
            </Box>
          ))}
        </Box>
      </Box>

      {/* The same readings as a table, for assistive tech. API values only. */}
      {/* A table ignores its own width, so a div does the hiding: without it the table
          would run off the page and make it scroll sideways. */}
      <Box sx={visuallyHidden}>
        <Box component="table" id="glance-chart-table">
          <caption>{fill(copy.tableCaption, { code })}</caption>
          <thead>
            <tr>
              {copy.columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.points.map((p) => (
              <tr key={p.reading.ledgerSeq}>
                <td>{p.reading.at}</td>
                <td>{p.reading.band}</td>
                <td>{p.reading.ledgerSeq}</td>
                <td>{p.reading.methodologyVersion}</td>
                <td>{confidenceOf(p.reading)}</td>
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>
    </Box>
  );
}
