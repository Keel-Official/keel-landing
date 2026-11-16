// The reader below is server-only through `api/client`. `glanceReadings` is pure.
import { cache } from 'react';

import { ustryHistory } from '../fixtures';
import { fetchHistory } from '../api/client';
import { readHero, HERO_ASSET_ID } from './readings';

import type { LandingReading } from './readings';
import type { Band, BandConfidence } from '../format/flags';
import type { AssetRisk, HistoryResponse } from '../api/types';

/**
 * Section 3, "Read Keel at a glance": one asset's band over time, and the evidence
 * behind its current band (Al, 16 November 2026: USTRY, the hero's asset).
 *
 * The history endpoint carries a band per reading but no confidence, price source or
 * methodology version per reading: those are on the envelope, or only on the current
 * reading from `/depth`. So the chart is the history's readings followed by the
 * current reading, and only fields a reading actually carries are shown for it.
 * Nothing is derived: an absent field is `null`, shown as "unknown".
 */
export interface BandReading {
  readonly ledgerSeq: number;
  /** `ledgerClosedAt`, as served. */
  readonly at: string;
  readonly band: Band;
  /** Only the current reading carries these; history readings have `null`. */
  readonly confidence: BandConfidence | null;
  readonly priceSource: AssetRisk['priceSource'] | null;
  /** The reading's methodology version: the history envelope's, or the current reading's own. */
  readonly methodologyVersion: string;
  /** True for the reading from `/depth`, the one the badge above the chart shows. */
  readonly current: boolean;
}

export interface LedgerGap {
  readonly from: number;
  readonly to: number;
}

export interface GlanceHistory {
  /** Sorted by ledger sequence, the current reading last when it is newer. */
  readonly readings: readonly BandReading[];
  readonly gaps: readonly LedgerGap[];
  /** The history envelope's methodology version. */
  readonly methodologyVersion: string;
  readonly live: boolean;
}

export interface Glance {
  /** The current reading, with its headers: the badge, Chart B and their provenance. */
  readonly reading: LandingReading;
  readonly history: GlanceHistory;
}

/**
 * The history's readings, sorted by ledger, then the current reading: appended when it
 * is newer than the last of them, in place of it when it is the same ledger, and left
 * out when it is older. A reading is never drawn twice.
 */
export function glanceReadings(
  response: HistoryResponse,
  current: AssetRisk,
  currentMethodology: string,
  live: boolean
): GlanceHistory {
  const readings: BandReading[] = [...response.points]
    .sort((a, b) => a.ledgerSeq - b.ledgerSeq)
    .map((point) => ({
      ledgerSeq: point.ledgerSeq,
      at: point.ledgerClosedAt,
      band: point.band,
      confidence: null,
      priceSource: null,
      methodologyVersion: response.methodologyVersion,
      current: false,
    }));

  const currentReading: BandReading = {
    ledgerSeq: current.ledgerSeq,
    at: current.ledgerClosedAt,
    band: current.band,
    confidence: current.bandConfidence ?? null,
    priceSource: current.priceSource,
    methodologyVersion: currentMethodology,
    current: true,
  };
  const last = readings.at(-1);
  // Newer: drawn last. The same ledger: the same reading, with more fields, so it
  // replaces the history's copy. Older: the history already shows past it.
  if (!last || current.ledgerSeq > last.ledgerSeq) readings.push(currentReading);
  else if (current.ledgerSeq === last.ledgerSeq) readings[readings.length - 1] = currentReading;

  return {
    readings,
    gaps: [...(response.gaps ?? [])]
      .sort((a, b) => a.from - b.from)
      .map(({ from, to }) => ({ from, to })),
    methodologyVersion: response.methodologyVersion,
    live,
  };
}

/**
 * The current reading is the hero's (one request between them). The history runs at
 * day resolution from the first stored reading to the current reading's ledger, with
 * a window so the engine reports its gaps. When either read fails, the saved
 * responses stand in, each with its own ledger and methodology version.
 */
export const readGlance = cache(async (): Promise<Glance> => {
  const reading = await readHero();
  if (reading.live) {
    const result = await fetchHistory(HERO_ASSET_ID, {
      from: ustryHistory.from,
      to: reading.reading.ledgerSeq,
      resolution: 'day',
    });
    if (result.data && result.data.points.length > 0)
      return {
        reading,
        history: glanceReadings(result.data, reading.reading, reading.methodologyVersion, true),
      };
  }
  return {
    reading,
    history: glanceReadings(ustryHistory, reading.reading, reading.methodologyVersion, false),
  };
});
