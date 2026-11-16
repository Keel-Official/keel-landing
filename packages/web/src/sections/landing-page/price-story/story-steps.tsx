'use client';

import type { StoryTimeline } from '@/lib/hooks/use-story-timeline';

import { useId } from 'react';
import { fill } from '@/lib/keel/format/fill';

import Box from '@mui/material/Box';

import { COPY } from '../copy';
import { MONO, EASE } from './stage-kit';

// ----------------------------------------------------------------------

const INK = '#0a0a0b';
const BODY = '#2A2A33';
const DIM = '#9A9AA3';
const LINE = 'rgba(10,10,15,0.10)';

const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const;

export interface StoryStepsProps {
  readonly timeline: StoryTimeline;
  /** Each step's body, placeholders already filled, for all six steps. */
  readonly bodies: readonly string[];
  /** The step numbers this list shows, in order. */
  readonly steps: readonly number[];
}

/**
 * The six steps as an accordion. The open step shows its body, and a line along its top
 * edge fills as its time runs. Clicking a step opens it and plays its scene from the
 * start. Hover and keyboard focus hold the open step (see `useStoryTimeline`).
 */
export function StorySteps({ timeline, bodies, steps }: StoryStepsProps) {
  const copy = COPY.story;
  const uid = useId();
  const { step, progress, reduced, mode, select, toggle, listProps } = timeline;

  return (
    <Box>
      <Box component="ol" {...listProps} sx={{ m: 0, p: 0, listStyle: 'none' }}>
        {steps.map((n) => {
          const index = n - 1;
          const s = copy.steps[index];
          const open = n === step;
          const bodyId = `${uid}-step-${n}`;

          return (
            <Box
              component="li"
              key={s.title}
              sx={{ position: 'relative', borderTop: `1px solid ${LINE}` }}
            >
              {/* Time left in the open step. */}
              <Box
                aria-hidden="true"
                sx={{
                  position: 'absolute',
                  top: -1,
                  left: 0,
                  right: 0,
                  height: '1.5px',
                  bgcolor: INK,
                  transformOrigin: '0 50%',
                }}
                style={{ transform: `scaleX(${open ? (reduced ? 1 : progress) : 0})` }}
              />

              <Box component="h3" sx={{ m: 0 }}>
                <Box
                  component="button"
                  type="button"
                  aria-expanded={open}
                  aria-controls={bodyId}
                  onClick={() => select(n)}
                  sx={{
                    all: 'unset',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '14px',
                    pt: { xs: '18px', md: '22px' },
                    pb: open ? '10px' : { xs: '18px', md: '22px' },
                    transition: `padding 450ms ${EASE}`,
                    '&:focus-visible': {
                      outline: '2px solid var(--story-price)',
                      outlineOffset: '4px',
                      borderRadius: '6px',
                    },
                    '&:hover .title': { color: open ? INK : '#55555F' },
                  }}
                >
                  <Box
                    component="span"
                    aria-hidden="true"
                    sx={{
                      ...MONO,
                      fontSize: 13,
                      color: open ? INK : DIM,
                      transition: 'color 300ms ease',
                      minWidth: 14,
                    }}
                  >
                    {n}
                  </Box>
                  <Box component="span" sx={visuallyHidden}>
                    {fill(copy.position, { n })}:{' '}
                  </Box>
                  <Box
                    component="span"
                    className="title"
                    sx={{
                      fontSize: { xs: '19px', md: '22px' },
                      fontWeight: 500,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.25,
                      color: open ? INK : DIM,
                      transition: 'color 300ms ease',
                    }}
                  >
                    {s.title}
                  </Box>
                </Box>
              </Box>

              <Box
                id={bodyId}
                sx={{
                  display: 'grid',
                  gridTemplateRows: open ? '1fr' : '0fr',
                  transition: reduced ? 'none' : `grid-template-rows 450ms ${EASE}`,
                }}
              >
                <Box
                  sx={{ overflow: 'hidden', minHeight: 0, visibility: open ? 'visible' : 'hidden' }}
                >
                  <Box
                    component="p"
                    sx={{
                      m: 0,
                      pl: '28px',
                      pb: '24px',
                      maxWidth: '52ch',
                      fontSize: '15px',
                      lineHeight: 1.6,
                      color: BODY,
                      opacity: open ? 1 : 0,
                      transition: reduced ? 'none' : `opacity 300ms ease ${open ? 150 : 0}ms`,
                    }}
                  >
                    {bodies[index]}
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {reduced ? null : (
        <Box
          component="button"
          type="button"
          onClick={toggle}
          sx={{
            all: 'unset',
            cursor: 'pointer',
            mt: 0,
            fontSize: 13,
            color: '#6B6B76',
            borderTop: `1px solid ${LINE}`,
            display: 'block',
            width: '100%',
            pt: '14px',
            '&:hover': { color: INK },
            '&:focus-visible': {
              outline: '2px solid var(--story-price)',
              outlineOffset: '4px',
              borderRadius: '6px',
            },
          }}
        >
          {mode === 'playing' ? copy.pause : copy.play}
        </Box>
      )}
    </Box>
  );
}
