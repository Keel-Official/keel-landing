import type { FocusEvent } from 'react';

import { useRef, useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export interface DrawLoopTiming {
  /** How long a drawing stays up, from the start of its draw. */
  readonly shownMs: number;
  /** How long the chart stays cleared before it draws again. */
  readonly clearedMs: number;
}

/**
 * The clock behind a chart that draws itself, holds, clears and draws again, round and
 * round, like the price story's steps (section 2). The chart stays a pure function of
 * `drawn`; this hook is the only place that reads time.
 *
 * It stops, with the chart drawn in full, while the reader hovers or keyboard-focuses
 * it, while they have paused it, while it is off screen, while the tab is hidden, and
 * always under `prefers-reduced-motion`. The server render and the first client render
 * show the chart drawn, so nothing is hidden without JavaScript.
 */
export function useDrawLoop<T extends Element>(timing: DrawLoopTiming) {
  const ref = useRef<T>(null);
  const [drawn, setDrawn] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [held, setHeld] = useState(false);
  const [paused, setPaused] = useState(false);
  // False from mount until the first drawing has started: what follows it (a badge)
  // settles once, not on every loop.
  const [settled, setSettled] = useState(true);
  // The first draw waits for the chart to come into view.
  const started = useRef(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener('change', apply);
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    const el = ref.current;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.4,
    });
    if (el) observer.observe(el);
    return () => {
      query.removeEventListener('change', apply);
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
    };
  }, []);

  // Before its first draw, a chart that may move waits cleared, out of sight.
  useEffect(() => {
    if (!reduced && !started.current) {
      setDrawn(false);
      setSettled(false);
    }
  }, [reduced]);

  useEffect(() => {
    if (drawn && started.current) setSettled(true);
  }, [drawn]);

  const stopped = reduced || paused || held || hidden || !visible;

  useEffect(() => {
    if (stopped) {
      // Held, paused or out of view: show the whole drawing, still. Off screen before
      // the first draw, keep waiting so the reader still sees it draw.
      if (started.current || reduced) setDrawn(true);
      return undefined;
    }
    started.current = true;
    const timer = window.setTimeout(
      () => setDrawn((d) => !d),
      drawn ? timing.shownMs : timing.clearedMs
    );
    return () => window.clearTimeout(timer);
  }, [drawn, stopped, reduced, timing.shownMs, timing.clearedMs]);

  const toggle = useCallback(() => setPaused((p) => !p), []);

  const holdProps = {
    onMouseEnter: () => setHeld(true),
    onMouseLeave: () => setHeld(false),
    onFocus: (event: FocusEvent<HTMLElement>) => {
      // Keyboard focus only: a click on the pause button must not also hold the chart.
      if (event.target.matches(':focus-visible')) setHeld(true);
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeld(false);
    },
  };

  return { ref, drawn, settled, reduced, paused, toggle, holdProps };
}
