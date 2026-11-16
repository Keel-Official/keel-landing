'use client';

import type { ReactNode, RefObject, CSSProperties } from 'react';

import { useId, useState, useEffect } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

/** Every scene draws in this box. HTML cards on top use the same units. */
export const VIEW = { width: 560, height: 360 } as const;

/** The line every scene stands on, and where its labels sit. */
export const BASE_Y = 296;
export const LABEL_Y = 322;

/**
 * The stage's colours. Marks use the DEC-001 story tokens; text stays in the section's
 * ink and muted colours, never a story colour.
 */
export const C = {
  ink: '#0A0A0F',
  ink2: '#2A2A33',
  muted: '#6B6B76',
  line: 'rgba(10,10,15,0.10)',
  soft: '#C9CDD4',
  price: 'var(--story-price)',
  depth: 'var(--story-depth)',
  sell: 'var(--story-sell)',
  pushed: 'var(--story-pushed)',
} as const;

export const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)';
/** A small overshoot, for things that grow or land. */
export const SPRING = 'cubic-bezier(0.34, 1.3, 0.64, 1)';

export const MONO = {
  fontFamily: '"Geist Mono", ui-monospace, monospace',
  fontVariantNumeric: 'tabular-nums',
} as const;

/**
 * What a scene is drawn from. `beat` counts the moves that have begun (0 before the
 * first); `elapsed` is ms into the step. Both come from `useStoryTimeline`, the only
 * clock in the story. `instant` turns transitions off while a scene resets out of view.
 */
export interface SceneProps {
  readonly beat: number;
  readonly elapsed: number;
  readonly instant: boolean;
}

/**
 * A length in stage units, for HTML laid over the SVG. On a narrow stage it stops
 * shrinking at 0.78px a unit, so card text stays readable on a phone.
 */
export const u = (n: number) => `max(calc(${n} * 100cqw / ${VIEW.width}), ${n * 0.78}px)`;

/** A transition, or none while the scene resets out of view. */
export const tr = (instant: boolean, value: string) => (instant ? 'none' : value);

/** Fades and lifts something in once `show` is true. */
export function reveal(show: boolean, instant: boolean, delayMs = 0): CSSProperties {
  return {
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0)' : 'translateY(6px)',
    filter: show ? 'none' : 'blur(3px)',
    transition: tr(
      instant,
      `opacity 450ms ease ${delayMs}ms, transform 700ms ${SPRING} ${delayMs}ms, filter 450ms ease ${delayMs}ms`
    ),
  };
}

/** Grows a bar up from its baseline once `show` is true. */
export function grow(show: boolean, instant: boolean, delayMs = 0): CSSProperties {
  return {
    transformBox: 'fill-box',
    transformOrigin: '50% 100%',
    transform: show ? 'scaleY(1)' : 'scaleY(0)',
    transition: tr(instant, `transform 950ms ${SPRING} ${delayMs}ms`),
  };
}

// ----------------------------------------------------------------------

/** A scene: the SVG drawing, with HTML cards laid over it in the same units. */
export function Scene({
  label,
  svg,
  children,
}: {
  label: string;
  svg: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Box sx={{ position: 'absolute', inset: 0 }}>
      <Box
        component="svg"
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        aria-label={label}
        sx={{ display: 'block', width: '100%', height: '100%', overflow: 'visible' }}
      >
        {svg}
      </Box>
      {children}
    </Box>
  );
}

/** A small label in the drawing. */
export function Label({
  x,
  y = LABEL_Y,
  anchor = 'middle',
  ink = false,
  style,
  children,
}: {
  x: number;
  y?: number;
  anchor?: 'start' | 'middle' | 'end';
  ink?: boolean;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={ink ? C.ink : C.muted}
      style={{ fontFamily: 'inherit', fontSize: 11.5, fontWeight: 500, ...style }}
    >
      {children}
    </text>
  );
}

/** The ground line. */
export function Baseline({ x1 = 40, x2 = 520 }: { x1?: number; x2?: number }) {
  return (
    <line
      x1={x1}
      y1={BASE_Y}
      x2={x2}
      y2={BASE_Y}
      stroke={C.line}
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
    />
  );
}

// ----------------------------------------------------------------------

type Anchor = 'left' | 'right' | 'above' | 'below' | 'belowStart';

const ANCHOR_TRANSFORM: Record<Anchor, string> = {
  left: 'translate(-100%, -50%)',
  right: 'translate(0, -50%)',
  above: 'translate(-50%, -100%)',
  below: 'translate(-50%, 0)',
  belowStart: 'translate(0, 0)',
};

/** The widest a card at `x` can be and stay inside the stage, in stage units. */
function room(x: number, anchor: Anchor) {
  const edge = 8;
  if (anchor === 'left') return x - edge;
  if (anchor === 'right' || anchor === 'belowStart') return VIEW.width - x - edge;
  return 2 * Math.min(x, VIEW.width - x) - 2 * edge;
}

/**
 * A white card floating over the drawing, placed at a point in stage units. `anchor`
 * says which side of the point the card sits on.
 */
export function FloatCard({
  x,
  y,
  anchor,
  show,
  instant,
  delayMs = 0,
  children,
  sx,
}: {
  x: number;
  y: number;
  anchor: Anchor;
  show: boolean;
  instant: boolean;
  delayMs?: number;
  children: ReactNode;
  sx?: object;
}) {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: `${(x / VIEW.width) * 100}%`,
        top: `${(y / VIEW.height) * 100}%`,
        transform: ANCHOR_TRANSFORM[anchor],
        pointerEvents: 'none',
      }}
    >
      <Box
        style={reveal(show, instant, delayMs)}
        sx={{
          bgcolor: '#fff',
          border: '1px solid rgba(10,10,15,0.08)',
          borderRadius: u(12),
          boxShadow: '0 1px 2px rgba(10,10,15,0.04), 0 8px 24px -8px rgba(10,10,15,0.12)',
          px: u(12),
          py: u(9),
          color: C.ink,
          fontSize: u(12),
          lineHeight: 1.35,
          // One line where it fits; it wraps rather than leave the stage on a phone.
          width: 'max-content',
          maxWidth: `calc(${room(x, anchor)} * 100cqw / ${VIEW.width})`,
          ...sx,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

/**
 * The last beat of every scene: a caption that says what the dot is doing, joined to
 * the dot by a short leader. The leader is drawn by `CalloutLeader` in the SVG.
 */
export function DotCaption({
  x,
  y,
  anchor,
  show,
  instant,
  color = C.price,
  children,
}: {
  x: number;
  y: number;
  anchor: Anchor;
  show: boolean;
  instant: boolean;
  color?: string;
  children: ReactNode;
}) {
  return (
    <FloatCard x={x} y={y} anchor={anchor} show={show} instant={instant}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: u(8), fontWeight: 500 }}>
        <Box
          component="span"
          aria-hidden="true"
          sx={{ width: u(8), height: u(8), borderRadius: '50%', bgcolor: color, flexShrink: 0 }}
        />
        {children}
      </Box>
    </FloatCard>
  );
}

/** The leader from a dot to its caption. */
export function CalloutLeader({
  from,
  to,
  show,
  instant,
}: {
  from: readonly [number, number];
  to: readonly [number, number];
  show: boolean;
  instant: boolean;
}) {
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke={C.ink}
      strokeOpacity={0.35}
      strokeWidth={1}
      strokeDasharray="2 3"
      vectorEffect="non-scaling-stroke"
      style={{ opacity: show ? 1 : 0, transition: tr(instant, 'opacity 300ms ease') }}
    />
  );
}

// ----------------------------------------------------------------------

/** 0 to 1 through a move that starts at `startMs` and lasts `durationMs`, eased. */
export function travel(elapsed: number, startMs: number, durationMs: number) {
  const t = Math.min(1, Math.max(0, (elapsed - startMs) / durationMs));
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

/**
 * Points along a path by length, measured once after mount, so a dot can ride the
 * path as it draws. Before then (and on the server) it has none, and the scene draws
 * the dot where the path ends.
 */
export function usePathSamples(ref: RefObject<SVGPathElement | null>, count = 240) {
  const [samples, setSamples] = useState<readonly (readonly [number, number])[]>([]);

  useEffect(() => {
    const path = ref.current;
    if (!path) return;
    const length = path.getTotalLength();
    setSamples(
      Array.from({ length: count + 1 }, (_, i) => {
        const p = path.getPointAtLength((length * i) / count);
        return [p.x, p.y] as const;
      })
    );
  }, [ref, count]);

  return samples;
}

/** The sampled point `q` (0 to 1) along a path, or `fallback` before it is measured. */
export function pointAt(
  samples: readonly (readonly [number, number])[],
  q: number,
  fallback: readonly [number, number]
) {
  if (samples.length === 0) return fallback;
  return samples[Math.round(q * (samples.length - 1))];
}

/** A smooth path through points (Catmull-Rom as cubic Béziers), as in the prototype. */
export function smoothPath(points: readonly (readonly [number, number])[]) {
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/**
 * A prefix for a scene's SVG ids (gradients), unique on the page: the story can be
 * drawn more than once (pinned and stacked layouts), and `url(#id)` must find its own.
 */
export function useSvgId() {
  return `ps${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}
