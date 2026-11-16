import type { StoryTimelineConfig } from '@/lib/hooks/use-story-timeline';

// ----------------------------------------------------------------------

/** How long each step stays open before the next one opens. */
export const STEP_MS = 7000;

/** The dot caption appears this long after a scene's last move begins. */
const CAPTION_AFTER_MS = 700;

/**
 * Per step, the ms at which each move of its scene begins, from the approved prototype
 * (`docs/design/prototypes/keel-story-prototype.html`). Each scene's last beat, added
 * here, is the caption that says what the dot is doing.
 */
const MOVES: readonly (readonly number[])[] = [
  // 1. The trail draws, "Last trade" lands, "Next trade" appears.
  [350, 2850, 3900],
  // 2. Offers rise on both sides, the sources show.
  [350, 1500],
  // 3. The range widens: 2%, 5%, 10%.
  [900, 2400, 4000],
  // 4. Price pushed up, collateral inflates, loan goes out, price falls back.
  [800, 2000, 3100, 4700],
  // 5. The climb starts, and reaches the top.
  [1000, 4400],
  // 6. Selling limit, manipulation limit, the lower one marked.
  [400, 1000, 2300],
];

const beats = MOVES.map((moves) => [...moves, moves[moves.length - 1] + CAPTION_AFTER_MS]);

/** Ms a beat's own transition needs to finish. */
const SETTLE_MS = 600;

export const STORY_TIMELINE: StoryTimelineConfig = {
  steps: MOVES.length,
  stepMs: STEP_MS,
  beats,
  settleMs: beats.map((b) => b[b.length - 1] + SETTLE_MS),
  // Al, 2026-11-16: the story plays round and round. "Pause the story" stops it.
  loop: true,
};

/** The beat number at which a step shows its dot caption. */
export const captionBeat = (step: number) => beats[step - 1].length;

/** Step 1: the trail draws from this ms, for this long. */
export const TRAIL = { startMs: 350, durationMs: 2400 } as const;

/** Step 5: the climb starts at this ms, for this long. */
export const CLIMB = { startMs: 1000, durationMs: 3400 } as const;
