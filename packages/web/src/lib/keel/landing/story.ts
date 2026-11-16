import { formatDecimal } from '../format/decimal';
import { xlmDepth, ustryDepth } from '../fixtures';

import type { AssetRisk } from '../api/types';

/**
 * Step 3 of "Price is not liquidity": the sell-side depth of USTRY and native XLM at
 * 2%, 5% and 10%, from the saved `GET /asset/{assetId}/depth` responses, so the step
 * reads the same when the API is down.
 *
 * Deep and thin follow the saved figures at 5%, as Al decided on 2026-11-16: USTRY
 * absorbs more selling there than XLM, so USTRY fills `{deepAsset}`. `story.test.ts`
 * fails if a fixture change reverses that.
 *
 * Values keep the served string. The display cuts fraction digits by slicing the
 * string, never by parsing it, and keeps `exact` alongside.
 */
export interface DepthRung {
  /** "2%", as the marker reads. */
  readonly label: string;
  /** "260,544.98 USDC", or null when the engine sent no rung at this delta. */
  readonly display: string | null;
  /** The served string. */
  readonly exact: string | null;
}

export interface DepthPanel {
  readonly code: string;
  readonly quote: string;
  readonly rungs: readonly DepthRung[];
  readonly ledgerSeq: number;
  readonly methodologyVersion: string;
}

const RUNGS = [
  { delta: 0.02, label: '2%' },
  { delta: 0.05, label: '5%' },
  { delta: 0.1, label: '10%' },
] as const;

function panel(reading: AssetRisk): DepthPanel {
  return {
    code: reading.asset.code,
    quote: reading.quote.code,
    rungs: RUNGS.map(({ delta, label }) => {
      const exact = reading.depth.find((row) => row.delta === delta)?.sellSide ?? null;
      return {
        label,
        exact,
        display:
          exact === null
            ? null
            : `${formatDecimal(exact, { maxFractionDigits: 2 }).display} ${reading.quote.code}`,
      };
    }),
    ledgerSeq: reading.ledgerSeq,
    methodologyVersion: reading.methodologyVersion,
  };
}

/** The deep market first, then the thin one. */
export function depthPanels(): readonly [DepthPanel, DepthPanel] {
  return [panel(ustryDepth), panel(xlmDepth)];
}

/** The rung the step 3 sentence quotes. */
const SENTENCE_RUNG = '5%';

/** What fills `{deepAsset}`, `{deepAmount}`, `{thinAsset}` and `{thinAmount}`. */
export function depthRoles([deep, thin]: readonly [DepthPanel, DepthPanel]) {
  const amount = (p: DepthPanel) =>
    p.rungs.find((rung) => rung.label === SENTENCE_RUNG)?.display ?? 'unknown';
  return {
    deepAsset: deep.code,
    deepAmount: amount(deep),
    thinAsset: thin.code,
    thinAmount: amount(thin),
  };
}
