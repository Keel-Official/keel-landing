'use client';

import type { HeroHistory } from '@/lib/keel/landing/history';
import type { LandingReading } from '@/lib/keel/landing/readings';

import { fill } from '@/lib/keel/format/fill';
import { BAND_ORDER } from '@/lib/keel/design/tokens';
import { formatDay } from '@/lib/keel/format/staleness';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { BandWord } from '@/components/keel/band-word';
import { HistoryLine } from '@/components/keel/history-line';

import { COPY } from './copy';
import { ReadingCard } from './hero-header/reading-card';

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */
const MONO = {
  fontFamily: '"Geist Mono", ui-monospace, monospace',
  fontFeatureSettings: '"ss01","ss02","zero"',
  fontVariantNumeric: 'tabular-nums',
} as const;

const CARD_BASE = {
  background: '#fff',
  border: '1px solid rgba(10,10,15,0.08)',
  borderRadius: '22px',
  padding: '36px',
  overflow: 'hidden',
} as const;

const CARD_H3_SX = {
  fontSize: '22px',
  letterSpacing: '-0.02em',
  fontWeight: 500,
  color: '#0A0A0F',
  lineHeight: 1.25,
} as const;

const BODY_SX = { fontSize: '13.5px', color: '#6B6B76', lineHeight: 1.6 } as const;

const KCHIP_SX = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: '#F7F7F9',
  border: '1px solid rgba(10,10,15,0.07)',
  borderRadius: '14px',
  px: '14px',
  py: '10px',
  overflow: 'hidden',
  ...MONO,
  fontSize: '13px',
  fontWeight: 500,
  color: '#2A2A33',
} as const;

/* ------------------------------------------------------------------ */
/* GlanceCard: section 3, on the large dark card                      */
/* ------------------------------------------------------------------ */

function GlanceCard({ history, hero }: { history: HeroHistory; hero: LandingReading }) {
  const copy = COPY.glance;
  const first = formatDay(history.firstAt);
  const last = formatDay(history.lastAt);
  const caption = { fontSize: '12px', color: 'rgba(255,255,255,0.55)', ...MONO };

  return (
    <Box
      sx={{
        ...CARD_BASE,
        gridColumn: { xs: '1 / -1', md: 'span 4' },
        gridRow: { xs: 'auto', md: 'span 2' },
        background: '#0A0A0F',
        border: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        color: '#fff',
        p: { xs: '24px', md: '36px' },
      }}
    >
      {/* Radial glow */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(110,139,255,0.15) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />
      {/* Dot grid */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ position: 'relative' }}>
        <Typography
          component="h2"
          sx={{ ...CARD_H3_SX, color: '#fff', fontSize: { xs: '24px', md: '28px' }, mb: 1 }}
        >
          {copy.title}
        </Typography>
        <Typography sx={{ ...BODY_SX, color: 'rgba(255,255,255,0.65)', maxWidth: '56ch' }}>
          {copy.body}
        </Typography>
      </Box>

      {/* The hero asset's safe collateral history, or the reading itself when there
          are fewer than two readings to draw. */}
      <Box sx={{ position: 'relative' }}>
        {history.drawn >= 2 ? (
          <>
            <HistoryLine
              points={history.points}
              label={fill(COPY.hero.historyLabel, { code: history.code, first, last })}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 1,
                ...caption,
              }}
            >
              <span>{first}</span>
              <span>{last}</span>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1, ...caption }}>
              <span>{fill(copy.ledger, { ledger: history.lastLedgerSeq ?? 'unknown' })}</span>
              <span>{fill(copy.methodology, { methodology: history.methodologyVersion })}</span>
            </Box>
          </>
        ) : (
          <ReadingCard data={hero} />
        )}
      </Box>

      {/* One line per band. The sentences are Al's to write. */}
      <Box component="ul" sx={{ position: 'relative', display: 'grid', gap: 1 }}>
        {BAND_ORDER.map((band) => (
          <Box
            component="li"
            key={band}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              flexWrap: 'wrap',
              fontSize: '13.5px',
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            <BandWord band={band} />
            {fill(copy.bandLine, { band })}
          </Box>
        ))}
      </Box>

      <Box sx={{ position: 'relative', display: 'grid', gap: 0.75, mt: 'auto' }}>
        {copy.notes.map((note) => (
          <Typography key={note} sx={{ ...BODY_SX, color: 'rgba(255,255,255,0.55)' }}>
            {note}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

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
    <Box sx={{ ...CARD_BASE, gridColumn: { xs: '1 / -1', md: 'span 3' } }}>
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
                background: '#0A0A0F',
                flexShrink: 0,
                mt: '9px',
              }}
            />
            <Typography sx={{ fontSize: '15px', color: '#2A2A33', lineHeight: 1.6 }}>
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
    <Box sx={{ ...CARD_BASE, gridColumn: { xs: '1 / -1', md: 'span 3' } }}>
      <Typography component="h3" sx={{ ...CARD_H3_SX, mb: 2 }}>
        {copy.title}
      </Typography>
      <Box component="ul" sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {copy.items.map(([name, line]) => (
          <Box
            component="li"
            key={name}
            sx={{
              background: '#fff',
              border: '1px solid rgba(10,10,15,0.07)',
              borderRadius: '16px',
              px: '16px',
              py: '12px',
              boxShadow: '0 1px 4px rgba(10,10,15,0.05)',
              fontSize: '13.5px',
              color: '#6B6B76',
              lineHeight: 1.5,
            }}
          >
            <Box component="strong" sx={{ color: '#0A0A0F', fontWeight: 600 }}>
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
/* BentoSection                                                        */
/* ------------------------------------------------------------------ */
export function BentoSection({ history, hero }: { history: HeroHistory; hero: LandingReading }) {
  return (
    <Box component="section" sx={{ py: { xs: '80px', md: '110px' }, background: '#FAFAFB' }}>
      <Container maxWidth={false} sx={{ maxWidth: '1240px', px: { xs: 2, sm: 3 } }}>
        {/* Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(6, 1fr)' },
            gridAutoRows: { xs: 'auto', md: 'minmax(290px, auto)' },
            gap: { xs: '10px', md: '14px' },
          }}
        >
          <GlanceCard history={history} hero={hero} />
          <ReproducibleCard hero={hero} />
          <UnknownCard />
          <AudienceCard />
          <CheckedRestCard />
        </Box>
      </Container>
    </Box>
  );
}
