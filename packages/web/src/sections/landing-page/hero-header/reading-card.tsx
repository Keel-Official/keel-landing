import type { LandingReading } from '@/lib/keel/landing/readings';

import { fill } from '@/lib/keel/format/fill';
import { formatDecimal } from '@/lib/keel/format/decimal';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { BandWord } from '@/components/keel/band-word';
import { AssetMark } from '@/components/keel/asset-mark';

import { COPY } from '../copy';
import { shortIssuer, provenanceLine } from '../reading';

// ----------------------------------------------------------------------

const INK = 'var(--ink)';

// Numbers use the same mono face as the rest of the page.
const MONO = {
  fontFamily: '"Geist Mono", ui-monospace, monospace',
  fontFeatureSettings: '"ss01","ss02","zero"',
  fontVariantNumeric: 'tabular-nums',
} as const;

const LINE_SX = { fontSize: 14, color: 'var(--muted)', lineHeight: 1.55 } as const;

/** Two fraction digits on screen, cut rather than rounded; the exact value on hover. */
function Amount({ value }: { value: string }) {
  const shown = formatDecimal(value, { maxFractionDigits: 2 });
  return (
    <Box component="strong" title={shown.exact} sx={{ ...MONO, fontWeight: 600, color: INK }}>
      {shown.display}
    </Box>
  );
}

/**
 * The verdict line and its variants, from `docs/landing-copy.md` section 1. Which one
 * shows is read from the payload; nothing is computed.
 */
function Verdict({ reading }: { reading: LandingReading['reading'] }) {
  const copy = COPY.hero;
  const code = reading.asset.code;
  const sx = { fontSize: 18, fontWeight: 500, color: INK, lineHeight: 1.4 };

  // A finding, not an error: no real trading stands behind any price.
  if (reading.priceSource === 'none')
    return <Typography sx={sx}>{fill(copy.noPrice, { code })}</Typography>;

  const amount = reading.maxSafeCollateral;
  if (amount === null || amount === undefined) {
    // "followed by the reason the API gives": the warnings that name the collateral
    // limit, as sent. None is shown when none does.
    const reasons = (reading.warnings ?? []).filter((warning) => /collateral/i.test(warning));
    return (
      <Box>
        <Typography sx={sx}>{fill(copy.noCollateral, { code })}</Typography>
        {reasons.map((reason) => (
          <Typography key={reason} sx={{ ...LINE_SX, mt: 0.5 }}>
            {reason}
          </Typography>
        ))}
      </Box>
    );
  }

  const [before, after] = copy.verdict.split('{amount}');
  return (
    <Typography sx={sx}>
      {fill(before, { code })}
      <Amount value={amount} />
      {fill(after, { quote: reading.quote.code })}
    </Typography>
  );
}

/**
 * The Keel reading card: one reading, as the engine sent it, with the ledger,
 * methodology version and staleness that make it reproducible.
 */
export function ReadingCard({ data }: { data: LandingReading }) {
  const copy = COPY.hero;
  const { reading } = data;
  const { asset } = reading;
  const [bandBefore, bandAfter] = copy.bandLine.split('{band}');

  return (
    <Box
      component="article"
      aria-label={`${asset.code} reading`}
      sx={{
        width: '100%',
        maxWidth: 440,
        mx: 'auto',
        textAlign: 'left',
        bgcolor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        p: { xs: '18px', sm: '22px' },
        boxShadow: '0 1px 2px rgba(15,26,36,0.04), 0 30px 60px -20px rgba(15,26,36,0.18)',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      {/* Asset: mark, code, and the shortened issuer (the API serves no home domain). */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <AssetMark code={asset.code} issuer={asset.issuer} size="md" />
        <Typography sx={{ fontSize: 14, color: 'var(--muted)' }}>
          <Box component="strong" sx={{ color: INK, fontWeight: 600 }}>
            {asset.code}
          </Box>{' '}
          {asset.issuer ? (
            <>
              {copy.issuedBy}{' '}
              <Box component="span" title={asset.issuer} sx={MONO}>
                {shortIssuer(asset.issuer)}
              </Box>
            </>
          ) : (
            copy.nativeAsset
          )}
        </Typography>
      </Box>

      <Verdict reading={reading} />

      <Typography sx={LINE_SX}>
        {bandBefore}
        <BandWord band={reading.band} />
        {fill(bandAfter, { confidence: reading.bandConfidence ?? 'unknown' })}
      </Typography>

      {reading.bandConfidence === 'partial' ? (
        <Typography sx={LINE_SX}>{copy.partial}</Typography>
      ) : null}

      <Typography
        sx={{
          ...MONO,
          fontSize: 12.5,
          color: 'var(--muted)',
          pt: 1.5,
          borderTop: '1px solid var(--border)',
        }}
      >
        {provenanceLine(data)}
      </Typography>
    </Box>
  );
}
