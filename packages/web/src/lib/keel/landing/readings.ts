// Server-only through `api/client`, which opens with `import 'server-only'`.
import { cache } from 'react';

import { fetchDepth, fetchAssets } from '../api/client';
import { ustryDepth, liveAssetList } from '../fixtures';

import type { AssetRisk } from '../api/types';

/** The hero's asset (Al, 13 November 2026). The asset id is code and issuer, never code alone. */
export const HERO_ASSET_ID = 'USTRY:GCRYUGD5NVARGXT56XEZI5CIFCQETYHAPQQTHO2O3IQZTHDH4LATMYWC';

/**
 * One reading as the landing page shows it: the payload, the provenance the engine
 * sent with it, and whether it is live. When the engine does not answer, the saved
 * response from `public/evidence` stands in and says so; nothing is made up to fill
 * the gap.
 */
export interface LandingReading {
  readonly reading: AssetRisk;
  /** From `X-Keel-Methodology-Version`, or the payload's own field when recorded. */
  readonly methodologyVersion: string;
  /** From `X-Keel-Staleness-Seconds`. Null for a recorded reading. */
  readonly stalenessSeconds: number | null;
  readonly live: boolean;
}

export function recordedReading(reading: AssetRisk): LandingReading {
  return {
    reading,
    methodologyVersion: reading.methodologyVersion,
    stalenessSeconds: null,
    live: false,
  };
}

/** The header is a whole count of seconds; anything else is treated as not sent. */
function wholeSeconds(header: string | null): number | null {
  if (header === null || !/^\d+$/.test(header)) return null;
  return Number.parseInt(header, 10);
}

/**
 * Cached per request: the hero and the footer show the same reading, so they make one
 * request between them and can never disagree.
 */
export const readHero = cache(async (): Promise<LandingReading> => {
  const result = await fetchDepth(HERO_ASSET_ID);
  if (!result.data) return recordedReading(ustryDepth);
  return {
    reading: result.data,
    methodologyVersion: result.provenance.methodologyVersion ?? result.data.methodologyVersion,
    stalenessSeconds: wholeSeconds(result.provenance.stalenessSeconds),
    live: true,
  };
});

/** How many assets the engine monitors, from `/assets`, or the saved list's total. */
export const readAssetCount = cache(async (): Promise<number> => {
  const result = await fetchAssets();
  return result.data?.total ?? liveAssetList.total;
});
