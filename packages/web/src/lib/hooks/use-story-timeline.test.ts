import { beatAt, selectStep, toggleStory, advanceStory } from './use-story-timeline';

import type { StoryState, StoryTimelineConfig } from './use-story-timeline';

const config: StoryTimelineConfig = {
  steps: 3,
  stepMs: 1000,
  beats: [[100, 500], [], [200]],
  settleMs: [600, 300, 400],
};

const free = { held: false, frozen: false };
const playing = (step: number, elapsed: number): StoryState => ({ step, elapsed, mode: 'playing' });

describe('story timeline', () => {
  it('runs the clock while playing', () => {
    expect(advanceStory(playing(1, 0), 16, free, config)).toEqual(playing(1, 16));
  });

  it('opens the next step when one runs out', () => {
    expect(advanceStory(playing(1, 990), 16, free, config)).toEqual(playing(2, 0));
  });

  it('comes back to step 1 after the last step, and stops there', () => {
    expect(advanceStory(playing(3, 990), 16, free, config)).toEqual({
      step: 1,
      elapsed: 1000,
      mode: 'ended',
    });
  });

  it('plays step 1 again after the last step when it loops', () => {
    expect(advanceStory(playing(3, 990), 16, free, { ...config, loop: true })).toEqual(
      playing(1, 0)
    );
  });

  it('runs through its span only, and loops back to the span start', () => {
    const looping = { ...config, loop: true };
    const span = { first: 2, last: 3 };
    expect(advanceStory(playing(2, 990), 16, free, looping, span)).toEqual(playing(3, 0));
    expect(advanceStory(playing(3, 990), 16, free, looping, span)).toEqual(playing(2, 0));
  });

  it('does not move when paused, ended or frozen', () => {
    const paused: StoryState = { step: 2, elapsed: 10, mode: 'paused' };
    const ended: StoryState = { step: 1, elapsed: 1000, mode: 'ended' };
    expect(advanceStory(paused, 16, free, config)).toBe(paused);
    expect(advanceStory(ended, 16, free, config)).toBe(ended);
    const frozen = playing(1, 10);
    expect(advanceStory(frozen, 16, { held: false, frozen: true }, config)).toBe(frozen);
  });

  it('lets a held step settle but never advance', () => {
    const held = { held: true, frozen: false };
    expect(advanceStory(playing(1, 590), 50, held, config)).toEqual(playing(1, 600));
    const settled = playing(1, 600);
    expect(advanceStory(settled, 50, held, config)).toBe(settled);
    const late = playing(1, 990);
    expect(advanceStory(late, 50, held, config)).toBe(late);
  });

  it('plays a chosen step from the start, or shows it finished when paused', () => {
    expect(selectStep(playing(1, 400), 3, config)).toEqual(playing(3, 0));
    expect(selectStep({ step: 1, elapsed: 400, mode: 'paused' }, 3, config)).toEqual({
      step: 3,
      elapsed: 1000,
      mode: 'paused',
    });
    expect(selectStep({ step: 1, elapsed: 1000, mode: 'ended' }, 2, config)).toEqual(playing(2, 0));
  });

  it('pauses, resumes where it was, and replays a finished step', () => {
    expect(toggleStory(playing(2, 400), config)).toEqual({ step: 2, elapsed: 400, mode: 'paused' });
    expect(toggleStory({ step: 2, elapsed: 400, mode: 'paused' }, config)).toEqual(playing(2, 400));
    expect(toggleStory({ step: 1, elapsed: 1000, mode: 'ended' }, config)).toEqual(playing(1, 0));
  });

  it('counts the beats that have begun', () => {
    expect(beatAt(0, [100, 500])).toBe(0);
    expect(beatAt(100, [100, 500])).toBe(1);
    expect(beatAt(999, [100, 500])).toBe(2);
  });
});
