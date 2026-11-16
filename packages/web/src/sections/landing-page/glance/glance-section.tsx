'use client';

import type { Glance } from '@/lib/keel/landing/glance';

import { useId, useState } from 'react';
import { fill } from '@/lib/keel/format/fill';
import { useDrawLoop } from '@/lib/hooks/use-draw-loop';
import { bandChart } from '@/lib/keel/landing/glance-chart';
import { formatStaleness } from '@/lib/keel/format/staleness';
import { BAND_ORDER, BAND_TOKENS } from '@/lib/keel/design/tokens';

import Box from '@mui/material/Box';

import { BandWord } from '@/components/keel/band-word';
import { AssetMark } from '@/components/keel/asset-mark';

import { COPY } from '../copy';
import { DepthRungs } from './depth-rungs';
import { shortIssuer, provenanceLine } from '../reading';
import { partialHatch, BandHistoryChart } from './band-history-chart';

// ----------------------------------------------------------------------

const INK = 'var(--ink)';
const BODY = 'var(--ink-2)';
const MUTED = 'var(--muted)';
const LINE = 'var(--border)';
const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)';
const DRAW_MS = 1600;

/**
 * Chart A redraws round and round, about seven seconds a turn, like a step of the price
 * story: the drawing stays up for six seconds from the start of its draw, then the
 * chart stays clear for a moment before it draws again.
 */
const DRAW_LOOP = { shownMs: 6000, clearedMs: 700 } as const;
const MONO = { fontFamily: '"Geist Mono", ui-monospace, monospace' } as const;

const PROVENANCE_SX = { m: 0, ...MONO, fontSize: 12, color: MUTED, lineHeight: 1.6 } as const;

/**
 * Chart A's provenance: the last plotted reading's ledger and methodology, with the
 * staleness the current reading's headers sent. A recorded history says it is one.
 */
function historyProvenance(glance: Glance): string {
  const copy = COPY.hero;
  const last = glance.history.readings.at(-1);
  const values = {
    ledger: last?.ledgerSeq ?? COPY.glance.unknown,
    methodology: last?.methodologyVersion ?? glance.history.methodologyVersion,
    staleness:
      glance.reading.stalenessSeconds === null
        ? ''
        : formatStaleness(glance.reading.stalenessSeconds),
  };
  if (!glance.history.live || !glance.reading.live) return fill(copy.recorded, values);
  return fill(
    glance.reading.stalenessSeconds === null ? copy.provenanceNoStaleness : copy.provenance,
    values
  );
}

export type GlanceSectionProps = { glance: Glance };

/**
 * `docs/landing-copy.md` section 3, "Read Keel at a glance": one asset's band in one
 * word, how that word changed over time (Chart A), and the evidence behind it on
 * request (Chart B). Light theme, real bands only: no story palette here.
 *
 * One moment of motion: when the section comes into view the band line draws left to
 * right once, then the badge settles. Opening the evidence expands it in place and its
 * rungs appear in order. With reduced motion everything shows in its final state.
 */
export function GlanceSection({ glance }: GlanceSectionProps) {
  const copy = COPY.glance;
  const { reading } = glance.reading;
  const chart = bandChart(glance.history.readings, glance.history.gaps);
  const loop = useDrawLoop<HTMLDivElement>(DRAW_LOOP);
  const { ref, reduced } = loop;
  const [open, setOpen] = useState(false);
  const evidenceId = useId();
  const token = BAND_TOKENS[reading.band];
  const partial = reading.bandConfidence === 'partial';

  return (
    <Box
      component="section"
      id="at-a-glance"
      aria-labelledby="glance-heading"
      sx={{ py: { xs: '72px', md: '104px' } }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 } }}>
        <Box
          component="h2"
          id="glance-heading"
          sx={{
            m: 0,
            fontSize: 'clamp(30px, 4vw, 48px)',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            color: INK,
            maxWidth: '20ch',
          }}
        >
          {copy.title}
        </Box>
        <Box
          component="p"
          sx={{ m: 0, mt: '16px', maxWidth: '56ch', fontSize: 16, lineHeight: 1.6, color: BODY }}
        >
          {copy.body}
        </Box>

        <Box
          ref={ref}
          sx={{
            mt: { xs: '32px', md: '48px' },
            bgcolor: 'var(--surface)',
            border: `1px solid ${LINE}`,
            borderRadius: { xs: '18px', md: '22px' },
            p: { xs: '20px', sm: '28px', md: '36px' },
          }}
        >
          {/* The reading: asset, band, confidence, the band's sentence. */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 14px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <AssetMark code={reading.asset.code} issuer={reading.asset.issuer} size="md" />
              <Box sx={{ fontSize: 15, color: MUTED }}>
                <Box component="strong" sx={{ color: INK, fontWeight: 600 }}>
                  {reading.asset.code} / {reading.quote.code}
                </Box>{' '}
                {reading.asset.issuer ? (
                  <>
                    {COPY.hero.issuedBy}{' '}
                    <Box component="span" title={reading.asset.issuer} sx={MONO}>
                      {shortIssuer(reading.asset.issuer)}
                    </Box>
                  </>
                ) : (
                  COPY.hero.nativeAsset
                )}
              </Box>
            </Box>
            <Box
              sx={{ fontSize: 15 }}
              style={{
                opacity: loop.settled ? 1 : 0,
                transform: loop.settled ? 'none' : 'scale(0.92)',
                transition: reduced
                  ? 'none'
                  : `opacity 300ms ease ${DRAW_MS}ms, transform 500ms ${EASE} ${DRAW_MS}ms`,
              }}
            >
              <BandWord band={reading.band} />
            </Box>
          </Box>
          {partial ? (
            <Box
              component="p"
              sx={{ m: 0, mt: '12px', fontSize: 14, color: BODY, lineHeight: 1.55 }}
            >
              {copy.notes[0]}
            </Box>
          ) : null}
          <Box
            component="p"
            sx={{ m: 0, mt: '6px', fontSize: 14, color: token.ink, lineHeight: 1.55 }}
          >
            {fill(copy.bandLine, { band: reading.band })}
          </Box>

          {/* Chart A, always visible. Hover or keyboard focus holds it drawn. */}
          <Box sx={{ mt: '28px' }} {...loop.holdProps}>
            <BandHistoryChart
              code={reading.asset.code}
              chart={chart}
              drawn={loop.drawn}
              reduced={reduced}
            />
            <Box component="p" sx={{ ...PROVENANCE_SX, mt: '6px' }}>
              {historyProvenance(glance)}
            </Box>
            {reduced ? null : (
              <Box
                component="button"
                type="button"
                onClick={loop.toggle}
                sx={{
                  all: 'unset',
                  cursor: 'pointer',
                  mt: '8px',
                  fontSize: 13,
                  color: MUTED,
                  '&:hover': { color: 'var(--accent)' },
                  '&:focus-visible': {
                    outline: '2px solid var(--accent)',
                    outlineOffset: '3px',
                    borderRadius: '4px',
                  },
                }}
              >
                {loop.paused ? copy.playChart : copy.pauseChart}
              </Box>
            )}
          </Box>

          {/* Legend: what partial means, what no price means, one line per band. */}
          <Box
            sx={{
              mt: '24px',
              pt: '20px',
              borderTop: `1px solid ${LINE}`,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: '18px', md: '32px' },
            }}
          >
            <Box
              component="ul"
              sx={{ m: 0, p: 0, listStyle: 'none', display: 'grid', gap: '10px' }}
            >
              <Box
                component="li"
                sx={{ display: 'flex', gap: '10px', fontSize: 13.5, color: BODY, lineHeight: 1.5 }}
              >
                <Box
                  aria-hidden="true"
                  sx={{
                    flexShrink: 0,
                    mt: '3px',
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: partialHatch(reading.band),
                    border: `2px solid ${token.mark}`,
                  }}
                />
                {copy.notes[0]}
              </Box>
              <Box component="li" sx={{ fontSize: 13.5, color: BODY, lineHeight: 1.5, pl: '24px' }}>
                {copy.notes[1]}
              </Box>
            </Box>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', display: 'grid', gap: '8px' }}>
              {BAND_ORDER.map((band) => (
                <Box
                  component="li"
                  key={band}
                  sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '10px',
                    fontSize: 13,
                    color: MUTED,
                  }}
                >
                  <BandWord band={band} />
                  {fill(copy.bandLine, { band })}
                </Box>
              ))}
            </Box>
          </Box>

          {/* The evidence, on request. */}
          <Box
            component="button"
            type="button"
            aria-expanded={open}
            aria-controls={evidenceId}
            onClick={() => setOpen((o) => !o)}
            sx={{
              mt: '24px',
              display: 'inline-flex',
              alignItems: 'center',
              height: 40,
              px: '18px',
              borderRadius: '999px',
              border: '1px solid var(--accent)',
              bgcolor: open ? 'var(--surface)' : 'var(--accent)',
              color: open ? 'var(--accent)' : 'var(--on-brand)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              '&:focus-visible': { outline: '2px solid var(--accent)', outlineOffset: '3px' },
            }}
          >
            {open ? copy.hideEvidence : copy.showEvidence}
          </Box>
          <Box
            id={evidenceId}
            sx={{
              display: 'grid',
              gridTemplateRows: open ? '1fr' : '0fr',
              transition: reduced ? 'none' : `grid-template-rows 450ms ${EASE}`,
            }}
          >
            <Box sx={{ overflow: 'hidden', minHeight: 0, visibility: open ? 'visible' : 'hidden' }}>
              <Box sx={{ pt: '24px' }}>
                <DepthRungs reading={reading} open={open} reduced={reduced} />
                <Box component="p" sx={{ ...PROVENANCE_SX, mt: '10px' }}>
                  {provenanceLine(glance.reading)}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
