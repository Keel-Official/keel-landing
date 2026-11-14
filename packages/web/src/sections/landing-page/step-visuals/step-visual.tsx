'use client';

import type { ReactNode } from 'react';

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

/**
 * The colours every step visual draws with: the "Price is not liquidity" section's own
 * text and border colours, one family. No band colours, no gradient, no glow, no shadow.
 */
export const STEP_VISUAL_COLORS = {
  /** Primary text, as in the card headings. */
  ink: '#0A0A0F',
  /** Muted text, as elsewhere on the page. */
  muted: '#6B6B76',
  /** The card's border. */
  line: 'rgba(10,10,15,0.08)',
} as const;

/** The height every step visual gets, so all six cards line up. */
export const STEP_VISUAL_HEIGHT = 72;

/**
 * Where a step visual is in its one-time entrance.
 *
 * - `final`: drawn in full. The server render, no JavaScript, reduced motion, and the
 *   end of the entrance all look like this.
 * - `armed`: hidden, waiting for the card to come into view.
 * - `play`: the entrance is running, and ends in the final look.
 */
export type StepVisualPhase = 'final' | 'armed' | 'play';

/**
 * Plays a step visual's entrance once, the first time it comes into view, and never
 * again. Under `prefers-reduced-motion: reduce` it stays in its final state. A visual
 * styles its own keyframes off `data-phase` on the element this ref is attached to.
 */
export function usePlayOnce<T extends Element>() {
  const ref = useRef<T>(null);
  const [phase, setPhase] = useState<StepVisualPhase>('final');

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    setPhase('armed');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase('play');
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, phase };
}

/**
 * The area at the bottom of a step card that holds its illustration: full card width
 * inside the card's own padding, a fixed height, pushed to the bottom so the card's text
 * stays on top and every card keeps the same height.
 */
export function StepVisual({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ mt: 'auto', pt: '20px' }}>
      <Box sx={{ height: STEP_VISUAL_HEIGHT, width: '100%' }}>{children}</Box>
    </Box>
  );
}
