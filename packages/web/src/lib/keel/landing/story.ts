import { formatDecimal } from '../format/decimal';
import { xlmDepth, ustryDepth } from '../fixtures';

import type { AssetRisk } from '../api/types';

/**
 * Step 3 of "Price is not liquidity": the 5% sell-side depth of native XLM and USTRY,
 * from the saved depth responses, so the step still reads when the API is down.
 *
 * Which asset fills `{deepAsset}` follows the saved figures, not a preference: on
 * these readings USTRY absorbs 260,649.22 USDC at 5% and XLM 91,490.48 USDC, so USTRY
 * is the deeper of the two. `story.test.ts` fails if a fixture change reverses that.
 *
 * Figures are cut to two fraction digits, never rounded, and keep their exact string.
 */
export interface DepthFigure {
  readonly code: string;
  /** "260,649.22 USDC", or null when the engine sent no 5% rung. */
  readonly amount: string | null;
  /** The served string, for a tooltip. */
  readonly exact: string | null;
  readonly ledgerSeq: number;
  readonly methodologyVersion: string;
}

const RUNG = 0.05;

function fivePercentSell(reading: AssetRisk): DepthFigure {
  const rung = reading.depth.find((row) => row.delta === RUNG);
  const exact = rung?.sellSide ?? null;
  return {
    code: reading.asset.code,
    amount:
      exact === null
        ? null
        : `${formatDecimal(exact, { maxFractionDigits: 2 }).display} ${reading.quote.code}`,
    exact,
    ledgerSeq: reading.ledgerSeq,
    methodologyVersion: reading.methodologyVersion,
  };
}

export function depthStep(): { deep: DepthFigure; thin: DepthFigure } {
  return { deep: fivePercentSell(ustryDepth), thin: fivePercentSell(xlmDepth) };
}
