'use client';

import type { LandingReading } from '@/lib/keel/landing/readings';

import { fill } from '@/lib/keel/format/fill';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { COPY } from './copy';

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */
const MONO = {
  fontFamily: '"Geist Mono", ui-monospace, monospace',
  fontFeatureSettings: '"ss01","ss02","zero"',
  fontVariantNumeric: 'tabular-nums',
} as const;

const CARD_BASE = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '22px',
  padding: '36px',
  overflow: 'hidden',
} as const;

const CARD_H3_SX = {
  fontSize: '22px',
  letterSpacing: '-0.02em',
  fontWeight: 500,
  color: 'var(--ink)',
  lineHeight: 1.25,
} as const;

const BODY_SX = { fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.6 } as const;

const KCHIP_SX = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  borderRadius: '14px',
  px: '14px',
  py: '10px',
  overflow: 'hidden',
  ...MONO,
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--ink-2)',
} as const;

/* ------------------------------------------------------------------ */
/* Section 4: built to be checked                                      */
/* ------------------------------------------------------------------ */

function ReproducibleCard({ hero }: { hero: LandingReading }) {
  const copy = COPY.checked;
  return (
    <Box sx={{ ...CARD_BASE, gridColumn: { xs: '1 / -1', sm: 'span 1', md: 'span 2' } }}>
      <Typography component="h3" sx={{ ...CARD_H3_SX, mb: 1 }}>
        {copy.title}
      </Typography>
      <Typography sx={{ ...BODY_SX, mb: 3 }}>{copy.reproducible}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={KCHIP_SX}>{fill(COPY.glance.ledger, { ledger: hero.reading.ledgerSeq })}</Box>
        <Box sx={KCHIP_SX}>
          {fill(COPY.glance.methodology, { methodology: hero.methodologyVersion })}
        </Box>
      </Box>
    </Box>
  );
}

function UnknownCard() {
  const copy = COPY.checked;
  return (
    <Box sx={{ ...CARD_BASE, gridColumn: { xs: '1 / -1', sm: 'span 1', md: 'span 2' } }}>
      <Typography component="h3" sx={{ ...CARD_H3_SX, mb: 1 }}>
        {copy.unknownTitle}
      </Typography>
      <Typography sx={{ ...BODY_SX, mb: 1.5 }}>{copy.unknownBody}</Typography>
      <Typography sx={BODY_SX}>{copy.listed}</Typography>
    </Box>
  );
}

function CheckedRestCard() {
  return (
    <Box sx={{ ...CARD_BASE, gridColumn: { xs: '1 / -1', md: 'span 2' } }}>
      <Box component="ul" sx={{ display: 'grid', gap: '14px' }}>
        {COPY.checked.rest.map((line) => (
          <Box
            component="li"
            key={line}
            sx={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}
          >
            <Box
              component="span"
              aria-hidden="true"
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--ink)',
                flexShrink: 0,
                mt: '9px',
              }}
            />
            <Typography sx={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.6 }}>
              {line}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Section 5: who it's for                                             */
/* ------------------------------------------------------------------ */

function AudienceCard() {
  const copy = COPY.audiences;
  return (
    <Box sx={{ ...CARD_BASE, gridColumn: '1 / -1' }}>
      <Typography component="h3" sx={{ ...CARD_H3_SX, mb: 2 }}>
        {copy.title}
      </Typography>
      <Box component="ul" sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {copy.items.map(([name, line]) => (
          <Box
            component="li"
            key={name}
            sx={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              px: '16px',
              py: '12px',
              boxShadow: '0 1px 4px rgba(15,26,36,0.05)',
              fontSize: '13.5px',
              color: 'var(--muted)',
              lineHeight: 1.5,
            }}
          >
            <Box component="strong" sx={{ color: 'var(--ink)', fontWeight: 600 }}>
              {name}
            </Box>{' '}
            {line}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* CheckedRows: sections 4 and 5, each in its own row                 */
/* ------------------------------------------------------------------ */
export function CheckedRows({ hero }: { hero: LandingReading }) {
  return (
    <Box component="section" sx={{ pb: { xs: '80px', md: '110px' } }}>
      <Container maxWidth={false} sx={{ maxWidth: '1240px', px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(6, 1fr)' },
            gridAutoRows: { xs: 'auto', md: 'minmax(290px, auto)' },
            gap: { xs: '10px', md: '14px' },
          }}
        >
          {/* Section 4 */}
          <ReproducibleCard hero={hero} />
          <UnknownCard />
          <CheckedRestCard />
          {/* Section 5 */}
          <AudienceCard />
        </Box>
      </Container>
    </Box>
  );
}
