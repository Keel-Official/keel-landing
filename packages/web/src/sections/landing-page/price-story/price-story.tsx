'use client';

import type { DepthPanel } from '@/lib/keel/landing/story';

import { fill } from '@/lib/keel/format/fill';
import { depthRoles } from '@/lib/keel/landing/story';
import { useStoryTimeline } from '@/lib/hooks/use-story-timeline';

import Box from '@mui/material/Box';

import { COPY } from '../copy';
import { EASE } from './stage-kit';
import { StorySteps } from './story-steps';
import { StoryStage } from './story-stage';
import { STORY_TIMELINE } from './story-timeline';

// ----------------------------------------------------------------------

/**
 * The six steps in two parts of three. Part one puts the steps on the left and the
 * stage on the right; part two swaps them.
 */
const PARTS = [
  [1, 2, 3],
  [4, 5, 6],
] as const;

const partOf = (step: number) => (step <= PARTS[0].length ? 0 : 1);

const GAP = 56;
const LIST_COLS = 5;
const STAGE_COLS = 7;

/** The column swap between parts. */
const SWAP = `900ms ${EASE}`;

/** In the row's own width (it is a size container): how far each column moves. */
const LIST_W = `calc((100cqw - ${GAP}px) * ${LIST_COLS} / 12)`;
const STAGE_W = `calc((100cqw - ${GAP}px) * ${STAGE_COLS} / 12)`;
const PAST_LIST = `calc((100cqw - ${GAP}px) * ${LIST_COLS} / 12 + ${GAP}px)`;
const PAST_STAGE = `calc((100cqw - ${GAP}px) * ${STAGE_COLS} / 12 + ${GAP}px)`;

// ----------------------------------------------------------------------

export type PriceStoryProps = {
  /** Step 3's two markets, deep first. */
  depth: readonly [DepthPanel, DepthPanel];
};

/**
 * `docs/landing-copy.md` section 2, "Price is not liquidity": an accordion of steps
 * beside a stage that draws the open step, three steps at a time. When step 3 ends the
 * stage and the steps slide past each other to swap sides and steps 4 to 6 open; after
 * step 6 they swap back to steps 1 to 3. On a phone the stage sits above the steps.
 * The text reads on its own with motion off.
 */
export function PriceStory({ depth }: PriceStoryProps) {
  const copy = COPY.story;
  const roles = depthRoles(depth);
  const bodies = copy.steps.map((s) => fill(s.body, roles));

  const timeline = useStoryTimeline(STORY_TIMELINE);
  const part = partOf(timeline.step);
  const swapped = part === 1;
  const motion = timeline.reduced ? 'none' : `transform ${SWAP}`;

  return (
    <Box
      component="section"
      id="how-it-works"
      ref={timeline.rootRef}
      aria-labelledby="how-it-works-heading"
      sx={{
        pt: { xs: '80px', md: '110px' },
        pb: { xs: '56px', md: '96px' },
        scrollMarginTop: { xs: '64px', lg: '72px' },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <Box
          component="h2"
          id="how-it-works-heading"
          sx={{
            m: 0,
            fontSize: 'clamp(34px, 4.4vw, 56px)',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            lineHeight: 1.04,
            color: 'var(--ink)',
          }}
        >
          {copy.title}
        </Box>

        <Box
          sx={{
            mt: { xs: '36px', md: '56px' },
            display: 'grid',
            gap: '28px',
            // Wide: both columns share one cell and slide to their side.
            '@media (min-width: 900px)': {
              containerType: 'inline-size',
              gridTemplateColumns: '1fr',
              alignItems: 'center',
              gap: 0,
              '& > *': { gridArea: '1 / 1' },
            },
          }}
        >
          <Box
            sx={{
              order: 2,
              '@media (min-width: 900px)': {
                order: 0,
                width: LIST_W,
                justifySelf: 'start',
                transform: swapped ? `translateX(${PAST_STAGE})` : 'translateX(0)',
                transition: motion,
              },
            }}
          >
            {/* The new part's steps rise in once the columns have crossed. */}
            <Box
              key={part}
              sx={{
                '@keyframes psPartIn': {
                  from: { opacity: 0, transform: 'translateY(14px)' },
                  to: { opacity: 1, transform: 'none' },
                },
                animation: timeline.reduced ? 'none' : `psPartIn 500ms ${EASE} 650ms both`,
              }}
            >
              <StorySteps timeline={timeline} bodies={bodies} steps={PARTS[part]} />
            </Box>
          </Box>

          <Box
            sx={{
              order: 1,
              mx: { xs: -3, sm: 0 },
              '@media (min-width: 900px)': {
                order: 0,
                zIndex: 1,
                width: STAGE_W,
                justifySelf: 'start',
                transform: swapped ? 'translateX(0)' : `translateX(${PAST_LIST})`,
                transition: motion,
              },
            }}
          >
            <StoryStage
              step={timeline.step}
              beat={timeline.beat}
              elapsed={timeline.elapsed}
              reduced={timeline.reduced}
              depth={depth}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
