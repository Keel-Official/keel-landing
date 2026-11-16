import { BAND_TOKENS } from '../design/tokens';

import type { Band } from '../format/flags';
import type { LedgerGap, BandReading } from './glance';

/**
 * Chart A's geometry, as fractions of the plot (0 to 1, y downwards), so the chart
 * component only scales them. Pure: same readings, same picture.
 *
 * x is the reading's own `ledgerClosedAt`, from the first reading to the last; the
 * axis never starts before the first recording. y is the band, one of four ordinal
 * levels, LOW at the bottom. Timestamps are parsed for position only; no risk figure
 * is touched here, and nothing is interpolated: a reported gap breaks the line.
 */

/** Where each band's level sits, LOW at the bottom, with room above and below. */
const TOP = 0.1;
const BOTTOM = 0.9;

export function bandLevel(band: Band): number {
  const { segment } = BAND_TOKENS[band];
  return BOTTOM - (segment / 3) * (BOTTOM - TOP);
}

export interface ChartPoint {
  readonly x: number;
  readonly y: number;
  readonly reading: BandReading;
}

/** A held band: from one reading to the next, in the first reading's band. */
export interface ChartRun {
  readonly x1: number;
  readonly x2: number;
  readonly y: number;
  readonly band: Band;
}

/** The step from one band to the next, at the later reading. */
export interface ChartRiser {
  readonly x: number;
  readonly y1: number;
  readonly y2: number;
}

/** A stretch with no recording, drawn as a gap. */
export interface ChartGap {
  readonly x1: number;
  readonly x2: number;
}

/** A change of methodology version, at the first reading under the new one. */
export interface ChartRule {
  readonly x: number;
  readonly version: string;
}

export interface ChartTick {
  readonly x: number;
  /** The reading's own timestamp, as served; the component formats it. */
  readonly at: string;
}

export interface BandChart {
  readonly points: readonly ChartPoint[];
  readonly runs: readonly ChartRun[];
  readonly risers: readonly ChartRiser[];
  readonly gaps: readonly ChartGap[];
  readonly rules: readonly ChartRule[];
  readonly ticks: readonly ChartTick[];
}

/** True when the engine reported no data between two consecutive readings. */
function broken(a: BandReading, b: BandReading, gaps: readonly LedgerGap[]) {
  return gaps.some((gap) => gap.from < b.ledgerSeq && gap.to > a.ledgerSeq);
}

/** At most four date labels, on readings spread across the range, first and last included. */
function tickIndices(count: number): number[] {
  if (count <= 4) return Array.from({ length: count }, (_, i) => i);
  return [
    ...new Set([0, Math.round((count - 1) / 3), Math.round((2 * (count - 1)) / 3), count - 1]),
  ];
}

export function bandChart(readings: readonly BandReading[], gaps: readonly LedgerGap[]): BandChart {
  const times = readings.map((r) => Date.parse(r.at));
  const t0 = times[0] ?? 0;
  const span = (times.at(-1) ?? t0) - t0;
  const xOf = (i: number) => (span > 0 ? (times[i] - t0) / span : 0.5);

  const points = readings.map((reading, i) => ({ x: xOf(i), y: bandLevel(reading.band), reading }));

  const runs: ChartRun[] = [];
  const risers: ChartRiser[] = [];
  const gapMarks: ChartGap[] = [];
  const rules: ChartRule[] = [];

  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    if (broken(a.reading, b.reading, gaps)) {
      gapMarks.push({ x1: a.x, x2: b.x });
    } else {
      runs.push({ x1: a.x, x2: b.x, y: a.y, band: a.reading.band });
      if (a.y !== b.y) risers.push({ x: b.x, y1: a.y, y2: b.y });
    }
    if (a.reading.methodologyVersion !== b.reading.methodologyVersion)
      rules.push({ x: b.x, version: b.reading.methodologyVersion });
  }

  return {
    points,
    runs,
    risers,
    gaps: gapMarks,
    rules,
    ticks: tickIndices(points.length).map((i) => ({ x: points[i].x, at: readings[i].at })),
  };
}
