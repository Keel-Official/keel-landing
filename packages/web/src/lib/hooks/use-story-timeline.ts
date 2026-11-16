import type { FocusEvent } from 'react';

import { useRef, useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

/**
 * The clock behind an auto-advancing story: which step is open, how far into it, and
 * whether it moves. The only place in the story that reads time; everything it drives
 * is a pure function of `step`, `beat` and `progress`.
 *
 * Steps are numbered from 1. A step lasts `stepMs`; its beats are moments inside it,
 * in ms from the step's start. One pass runs step 1 to the last step and comes back to
 * step 1, then stops, unless `loop` is set: then it plays step 1 again, and keeps going
 * until the reader pauses it.
 */
export interface StoryTimelineConfig {
  readonly steps: number;
  readonly stepMs: number;
  /** Per step, in order: the ms at which each beat begins. */
  readonly beats: readonly (readonly number[])[];
  /**
   * Per step: the ms by which its scene has finished moving. While the reader holds a
   * step (hover, keyboard focus) the clock runs up to this point and waits there, so
   * the scene completes but the step does not advance.
   */
  readonly settleMs: readonly number[];
  /** After the last step, play step 1 again instead of stopping there. */
  readonly loop?: boolean;
}

/**
 * - `playing`: the clock runs and steps advance.
 * - `paused`: the reader paused it. Nothing moves.
 * - `ended`: one pass is over and it is back on step 1. Nothing moves until asked.
 */
export type StoryMode = 'playing' | 'paused' | 'ended';

export interface StoryState {
  readonly step: number;
  readonly elapsed: number;
  readonly mode: StoryMode;
}

export interface StoryHold {
  /** Hover or keyboard focus on the steps: let the scene settle, do not advance. */
  readonly held: boolean;
  /** Tab hidden or section off screen: stop the clock. */
  readonly frozen: boolean;
}

/** The steps a clock runs through, first to last, both included. */
export interface StorySpan {
  readonly first: number;
  readonly last: number;
}

/** All of a story's steps. */
export const fullSpan = (config: StoryTimelineConfig): StorySpan => ({
  first: 1,
  last: config.steps,
});

/**
 * One frame of the clock. Returns the same object when nothing changed. The clock runs
 * through `span` only: after its last step it goes back to its first.
 */
export function advanceStory(
  state: StoryState,
  dtMs: number,
  hold: StoryHold,
  config: StoryTimelineConfig,
  span: StorySpan = fullSpan(config)
): StoryState {
  if (state.mode !== 'playing' || hold.frozen || dtMs <= 0) return state;

  let elapsed = state.elapsed + dtMs;
  if (hold.held) {
    elapsed = Math.min(elapsed, Math.max(state.elapsed, config.settleMs[state.step - 1]));
  }
  if (elapsed === state.elapsed) return state;
  if (elapsed < config.stepMs) return { ...state, elapsed };

  if (state.step < span.last) return { step: state.step + 1, elapsed: 0, mode: 'playing' };
  return config.loop
    ? { step: span.first, elapsed: 0, mode: 'playing' }
    : { step: span.first, elapsed: config.stepMs, mode: 'ended' };
}

/** Opening a step: paused, it shows its final state; otherwise it plays from the start. */
export function selectStep(
  state: StoryState,
  step: number,
  config: StoryTimelineConfig
): StoryState {
  return state.mode === 'paused'
    ? { step, elapsed: config.stepMs, mode: 'paused' }
    : { step, elapsed: 0, mode: 'playing' };
}

/** The pause/play control. A finished step plays again rather than skipping ahead. */
export function toggleStory(state: StoryState, config: StoryTimelineConfig): StoryState {
  if (state.mode === 'playing') return { ...state, mode: 'paused' };
  return {
    step: state.step,
    elapsed: state.elapsed >= config.stepMs ? 0 : state.elapsed,
    mode: 'playing',
  };
}

/** How many of a step's beats have begun. */
export function beatAt(elapsed: number, beats: readonly number[]): number {
  return beats.filter((at) => elapsed >= at).length;
}

// ----------------------------------------------------------------------

/** A frame longer than this is a stall (a background tab, a debugger), not time passing. */
const MAX_FRAME_MS = 100;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export interface StoryTimeline {
  readonly step: number;
  readonly beat: number;
  /** ms into the step. */
  readonly elapsed: number;
  /** 0 to 1 through the step. */
  readonly progress: number;
  readonly mode: StoryMode;
  /** Reduced motion: every step shows its final state and nothing advances. */
  readonly reduced: boolean;
  readonly select: (step: number) => void;
  readonly toggle: () => void;
  /** On the section: the clock stops while it is off screen. */
  readonly rootRef: (el: Element | null) => void;
  /** On the step list: hover and keyboard focus hold the current step. */
  readonly listProps: {
    readonly onMouseEnter: () => void;
    readonly onMouseLeave: () => void;
    readonly onFocus: (event: FocusEvent<HTMLElement>) => void;
    readonly onBlur: (event: FocusEvent<HTMLElement>) => void;
  };
}

export function useStoryTimeline(
  config: StoryTimelineConfig,
  span: StorySpan = fullSpan(config)
): StoryTimeline {
  // The server render, and the first client render, show the span's first step
  // complete and still.
  const [state, setState] = useState<StoryState>({
    step: span.first,
    elapsed: config.stepMs,
    mode: 'paused',
  });
  const [reduced, setReduced] = useState(false);

  const hover = useRef(false);
  const focus = useRef(false);
  const offscreen = useRef(true);
  const observer = useRef<IntersectionObserver | null>(null);

  // The span can change (a scroll moves the story on to its next steps): the clock reads
  // it from here, and a step outside the new span gives way to the span's first.
  const spanRef = useRef(span);
  spanRef.current = span;
  useEffect(() => {
    setState((s) => {
      if (s.step >= span.first && s.step <= span.last) return s;
      return s.mode === 'playing'
        ? { step: span.first, elapsed: 0, mode: 'playing' }
        : { step: span.first, elapsed: config.stepMs, mode: s.mode };
    });
  }, [span.first, span.last, config.stepMs]);

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    const apply = () => {
      setReduced(query.matches);
      setState((s) =>
        query.matches
          ? { step: s.step, elapsed: config.stepMs, mode: 'paused' }
          : { step: s.step, elapsed: 0, mode: 'playing' }
      );
    };
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, [config.stepMs]);

  const playing = state.mode === 'playing' && !reduced;

  useEffect(() => {
    if (!playing) return undefined;
    let frame = 0;
    let last: number | null = null;
    const tick = (now: number) => {
      const dt = last === null ? 0 : Math.min(now - last, MAX_FRAME_MS);
      last = now;
      const hold = {
        held: hover.current || focus.current,
        frozen: document.hidden || offscreen.current,
      };
      setState((s) => advanceStory(s, dt, hold, config, spanRef.current));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, config]);

  const rootRef = useCallback((el: Element | null) => {
    observer.current?.disconnect();
    observer.current = null;
    if (!el) return;
    observer.current = new IntersectionObserver(
      ([entry]) => {
        offscreen.current = !entry.isIntersecting;
      },
      { threshold: 0.25 }
    );
    observer.current.observe(el);
  }, []);

  const select = useCallback(
    (step: number) =>
      setState((s) =>
        reduced ? { step, elapsed: config.stepMs, mode: 'paused' } : selectStep(s, step, config)
      ),
    [reduced, config]
  );

  const toggle = useCallback(() => setState((s) => toggleStory(s, config)), [config]);

  const listProps = {
    onMouseEnter: () => {
      hover.current = true;
    },
    onMouseLeave: () => {
      hover.current = false;
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      // Keyboard focus only: a mouse click also focuses a step, and that must not hold it.
      focus.current = event.target.matches(':focus-visible');
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        focus.current = false;
      }
    },
  };

  const elapsed = reduced ? config.stepMs : state.elapsed;
  const beats = config.beats[state.step - 1];

  return {
    step: state.step,
    beat: beatAt(elapsed, beats),
    elapsed,
    progress: Math.min(1, elapsed / config.stepMs),
    mode: reduced ? 'paused' : state.mode,
    reduced,
    select,
    toggle,
    rootRef,
    listProps,
  };
}
