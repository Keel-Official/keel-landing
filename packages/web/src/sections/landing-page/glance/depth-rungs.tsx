import type { AssetRisk } from '@/lib/keel/api/types';

import { fill } from '@/lib/keel/format/fill';

import Box from '@mui/material/Box';

import { COPY } from '../copy';

// ----------------------------------------------------------------------

const MUTED = 'var(--muted)';
const MONO = {
  fontFamily: '"Geist Mono", ui-monospace, monospace',
  fontVariantNumeric: 'tabular-nums',
} as const;

/** `0.05` as "5%". `delta` is one of the API's three rungs, a number by contract. */
const rungLabel = (delta: number) => `${Math.round(delta * 1000) / 10}%`;

export type DepthRungsProps = {
  readonly reading: AssetRisk;
  /** True while the evidence is open: the rungs then appear 2%, then 5%, then 10%. */
  readonly open: boolean;
  readonly reduced: boolean;
};

/**
 * Chart B, for now: the sell-side depth at the API's three rungs as a labelled list of
 * the strings the API sent, unrounded and uncut. It becomes an X/Y chart only once a
 * decision allows mapping decimal strings to pixel positions (draft DEC-002).
 * Rungs are sorted by delta; there is nothing between them.
 */
export function DepthRungs({ reading, open, reduced }: DepthRungsProps) {
  const copy = COPY.glance;
  const rungs = [...reading.depth].sort((a, b) => a.delta - b.delta);

  return (
    <Box>
      <Box component="h3" sx={{ m: 0, fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
        {fill(copy.depthTitle, { quote: reading.quote.code })}
      </Box>
      <Box component="dl" sx={{ m: 0, mt: '12px', display: 'grid', gap: '8px' }}>
        {rungs.map((rung, i) => (
          <Box
            key={rung.delta}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '120px 1fr' },
              gap: { xs: '2px', sm: '16px' },
              alignItems: 'baseline',
              py: '10px',
              borderTop: '1px solid var(--border)',
            }}
            style={{
              opacity: open ? 1 : 0,
              transform: open ? 'none' : 'translateY(6px)',
              transition: reduced
                ? 'none'
                : `opacity 300ms ease ${150 + i * 180}ms, transform 300ms ease ${150 + i * 180}ms`,
            }}
          >
            <Box component="dt" sx={{ fontSize: 13.5, color: MUTED }}>
              {fill(copy.depthLabel, { delta: rungLabel(rung.delta) })}
            </Box>
            <Box
              component="dd"
              sx={{ m: 0, ...MONO, fontSize: 13, color: 'var(--ink)', wordBreak: 'break-all' }}
            >
              {rung.sellSide ?? copy.unknown} {reading.quote.code}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
