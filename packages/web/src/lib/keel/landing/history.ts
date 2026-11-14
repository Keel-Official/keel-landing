// The readers below are server-only through `api/client`. `historyLine` is pure.
import { cache } from 'react';

import { ustryHistory } from '../fixtures';
import { fetchHistory } from '../api/client';
import { plotSeries } from '../chart/geometry';
import { readHero, HERO_ASSET_ID } from './readings';

import type { HistoryResponse } from '../api/types';

/** A point in the history line's 400 by 100 viewBox. */
export interface HistoryPoint {
  readonly x: number;
  readonly y: number;
}

export interface HeroHistory {
  readonly code: string;
  /** Points in reading order; null breaks the line (a gap or an unknown value). */
  readonly points: readonly (HistoryPoint | null)[];
  /** The readings drawn, so a caller can refuse to draw fewer than two. */
  readonly drawn: number;
  /** The first and last readings' own timestamps, as served. */
  readonly firstAt: string;
  readonly lastAt: string;
  /** The last reading's ledger and the series' methodology version, as served. */
  readonly lastLedgerSeq: number | null;
  readonly methodologyVersion: string;
  readonly live: boolean;
}

const WIDTH = 400;
const HEIGHT = 100;
const PAD = 6;

/**
 * The hero asset's safe collateral history as viewBox points.
 *
 * Coordinates come from `plotSeries`, the dashboard's mapper and the one place a
 * served decimal becomes a number, for geometry only. x runs by ledger sequence,
 * which advances with time; y by `maxSafeCollateral` over the series' own range.
 * A reading with no value, and every gap the engine reports, breaks the line: it is
 * never drawn as zero and never bridged.
 */
export function historyLine(response: HistoryResponse, live: boolean): HeroHistory {
  const readings = [...response.points].sort((a, b) => a.ledgerSeq - b.ledgerSeq);
  const plotted = plotSeries(
    readings.map((point) => ({
      at: point.ledgerSeq,
      value: point.maxSafeCollateral,
    })),
    { gaps: response.gaps ?? [] }
  );

  const points: (HistoryPoint | null)[] = [];
  plotted.segments.forEach((segment, index) => {
    if (index > 0) points.push(null);
    for (const point of segment)
      points.push({
        x: PAD + point.x * (WIDTH - 2 * PAD),
        y: HEIGHT - PAD - point.y * (HEIGHT - 2 * PAD),
      });
  });

  return {
    code: response.asset.code,
    points,
    drawn: points.filter((point) => point !== null).length,
    firstAt: readings[0]?.ledgerClosedAt ?? '',
    lastAt: readings.at(-1)?.ledgerClosedAt ?? '',
    lastLedgerSeq: readings.at(-1)?.ledgerSeq ?? null,
    methodologyVersion: response.methodologyVersion,
    live,
  };
}

/**
 * Live from `/asset/{id}/history` at day resolution, from the first stored reading
 * to the hero reading's own ledger, so the line ends where the card's figure stands.
 * When the engine does not answer, the saved response stands in.
 */
export const readHeroHistory = cache(async (): Promise<HeroHistory> => {
  const hero = await readHero();
  if (hero.live) {
    const result = await fetchHistory(HERO_ASSET_ID, {
      from: ustryHistory.from,
      to: hero.reading.ledgerSeq,
      resolution: 'day',
    });
    if (result.data) return historyLine(result.data, true);
  }
  return historyLine(ustryHistory, false);
});
