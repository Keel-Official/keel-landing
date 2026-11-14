'use client';

import type { DepthFigure } from '@/lib/keel/landing/story';

import { fill } from '@/lib/keel/format/fill';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import { COPY } from './copy';
import { StepVisual, STEP_VISUALS } from './step-visuals';

// ----------------------------------------------------------------------

const StepCard = styled('article')({
  backgroundColor: '#fff',
  border: '1px solid rgba(10,10,15,0.08)',
  borderRadius: 22,
  padding: 28,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'border-color 200ms, background 200ms',
  '&:hover': {
    borderColor: 'rgba(10,10,15,0.12)',
    background: '#fdfdfd',
  },
});

const MONO = {
  fontFamily: '"Geist Mono", ui-monospace, monospace',
  fontVariantNumeric: 'tabular-nums',
} as const;

// ----------------------------------------------------------------------

export type HowItWorksProps = {
  depth: { deep: DepthFigure; thin: DepthFigure };
};

/** `docs/landing-copy.md` section 2: six steps, in order, numbered. */
export function HowItWorks({ depth }: HowItWorksProps) {
  const copy = COPY.story;
  const { deep, thin } = depth;

  const bodyOf = (index: number, body: string) =>
    index !== 2
      ? body
      : fill(body, {
          deepAsset: deep.code,
          deepAmount: deep.amount ?? 'unknown',
          thinAsset: thin.code,
          thinAmount: thin.amount ?? 'unknown',
        });

  return (
    <Box
      component="section"
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      sx={{
        bgcolor: '#FAFAFB',
        pt: { xs: '80px', md: '110px' },
        pb: { xs: '40px', md: '56px' },
        scrollMarginTop: { xs: '64px', lg: '72px' },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        {/* Header */}
        <Box
          component="h2"
          id="how-it-works-heading"
          sx={{
            m: 0,
            textAlign: 'center',
            fontSize: 'clamp(34px, 4.4vw, 56px)',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            lineHeight: 1.04,
            color: '#0a0a0b',
          }}
        >
          {copy.title}
        </Box>

        {/* Step grid: two rows of three */}
        <Box
          component="ol"
          sx={{
            mt: '56px',
            p: 0,
            listStyle: 'none',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            // Every row shares one height, so all six cards match at every width.
            gridAutoRows: '1fr',
            gap: '14px',
            alignItems: 'stretch',
          }}
        >
          {copy.steps.map((step, index) => (
            <Box component="li" key={step.title} sx={{ m: 0, height: '100%' }}>
              <StepCard aria-label={fill(copy.position, { n: index + 1 })}>
                <Box
                  component="span"
                  aria-hidden="true"
                  sx={{
                    ...MONO,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'flex-start',
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#0A0A0F',
                    bgcolor: 'rgba(10,10,15,0.05)',
                  }}
                >
                  {index + 1}
                </Box>

                <Box
                  component="h3"
                  sx={{
                    m: 0,
                    mt: '16px',
                    mb: '8px',
                    fontSize: '20px',
                    fontWeight: 500,
                    letterSpacing: '-0.02em',
                    color: '#0a0a0b',
                  }}
                >
                  {step.title}
                </Box>

                <Box
                  component="p"
                  sx={{ m: 0, fontSize: '14.5px', color: '#2A2A33', lineHeight: 1.6 }}
                >
                  {bodyOf(index, step.body)}
                </Box>

                {STEP_VISUALS[index + 1] ? (
                  <StepVisual>{STEP_VISUALS[index + 1]}</StepVisual>
                ) : null}
              </StepCard>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
