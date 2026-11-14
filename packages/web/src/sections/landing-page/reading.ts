import type { LandingReading } from '@/lib/keel/landing/readings';

import { fill } from '@/lib/keel/format/fill';
import { formatStaleness } from '@/lib/keel/format/staleness';

import { COPY } from './copy';

/**
 * "Ledger N. Methodology V. Updated T ago." for a live reading, with staleness written
 * as unknown when the header did not come, and a recorded reading saying it is one.
 * The hero card and the footer both use it, from the same reading
 * (keel-frontend `components/marketing/hero.tsx`).
 */
export function provenanceLine(data: LandingReading): string {
  const copy = COPY.hero;
  return fill(
    !data.live
      ? copy.recorded
      : data.stalenessSeconds === null
        ? copy.provenanceNoStaleness
        : copy.provenance,
    {
      ledger: data.reading.ledgerSeq,
      methodology: data.methodologyVersion,
      staleness: data.stalenessSeconds === null ? '' : formatStaleness(data.stalenessSeconds),
    }
  );
}

/** keel-frontend `components/keel/result.tsx`: six characters, an ellipsis, the last four. */
export const shortIssuer = (issuer: string) => `${issuer.slice(0, 6)}…${issuer.slice(-4)}`;
