'use client';

import type { HistoryPoint } from '@/lib/keel/landing/history';

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';

/** How long the line takes to draw itself, once (keel-frontend, decision 003). */
const DRAW_MS = 1600;

/**
 * Step-after path: each reading holds until the next one, no smoothing. A null
 * reading (an unknown value, or a gap the engine reports) breaks the line; it is never
 * drawn as zero and never bridged. Ported from keel-frontend `history-line.tsx`.
 */
export function stepAfterPath(points: readonly (HistoryPoint | null)[]): string {
  let d = '';
  let open = false;
  for (const point of points) {
    if (point === null) {
      open = false;
      continue;
    }
    if (open) d += ` H ${point.x} V ${point.y}`;
    else d += `${d === '' ? '' : ' '}M ${point.x} ${point.y}`;
    open = true;
  }
  return d;
}

/**
 * The safe collateral history as one line that draws itself once when it comes into
 * view, then stays still. It never loops. Under `prefers-reduced-motion` it is drawn
 * in full at once. The drawing uses the fork's stroke-dashoffset technique: the
 * path's own length is the dash, and the offset runs from that length to zero.
 *
 * No value axis and no tick numbers: those would be rounded, derived figures.
 */
export function HistoryLine({
  points,
  label,
}: {
  points: readonly (HistoryPoint | null)[];
  /** "Safe collateral size for {CODE}, {first} to {last}". */
  label: string;
}) {
  const d = stepAfterPath(points);
  const figureRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState<number | null>(null);
  const [drawn, setDrawn] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength());
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, [d]);

  // Draw once, the first time the line is in view.
  useEffect(() => {
    const el = figureRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const last = [...points].reverse().find((point): point is HistoryPoint => point !== null);
  const full = reduce || drawn;

  return (
    <Box component="figure" ref={figureRef} aria-label={label} sx={{ m: 0, width: '100%' }}>
      {/* Fixed 4:1, so the drawing is never stretched and the dot stays round. */}
      <svg
        viewBox="0 0 400 100"
        aria-hidden="true"
        focusable="false"
        style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
      >
        <path
          ref={pathRef}
          d={d}
          fill="none"
          stroke="#fff"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={
            length === null
              ? { opacity: 0 }
              : {
                  strokeDasharray: length,
                  strokeDashoffset: full ? 0 : length,
                  transition: reduce ? 'none' : `stroke-dashoffset ${DRAW_MS}ms ease-out`,
                }
          }
        />
        {last ? (
          <circle
            cx={last.x}
            cy={last.y}
            r={2.5}
            fill="#fff"
            style={{
              opacity: full && length !== null ? 1 : 0,
              transition: reduce ? 'none' : `opacity 200ms ease ${DRAW_MS}ms`,
            }}
          />
        ) : null}
      </svg>
    </Box>
  );
}
