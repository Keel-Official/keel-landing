import { STEP_MS, captionBeat, STORY_TIMELINE } from './story-timeline';

describe('price story timeline', () => {
  it('has one entry per step for beats and settle times', () => {
    expect(STORY_TIMELINE.beats).toHaveLength(STORY_TIMELINE.steps);
    expect(STORY_TIMELINE.settleMs).toHaveLength(STORY_TIMELINE.steps);
  });

  it('starts every beat, and settles every scene, inside its step', () => {
    STORY_TIMELINE.beats.forEach((beats, i) => {
      expect([...beats].sort((a, b) => a - b)).toEqual(beats);
      expect(beats[beats.length - 1]).toBeLessThan(STEP_MS);
      expect(STORY_TIMELINE.settleMs[i]).toBeGreaterThan(beats[beats.length - 1]);
      expect(STORY_TIMELINE.settleMs[i]).toBeLessThanOrEqual(STEP_MS);
    });
  });

  it('ends every scene on the dot caption', () => {
    STORY_TIMELINE.beats.forEach((beats, i) => {
      expect(captionBeat(i + 1)).toBe(beats.length);
    });
  });

  it('loops back to step 1 after step 6', () => {
    expect(STORY_TIMELINE.loop).toBe(true);
  });
});
