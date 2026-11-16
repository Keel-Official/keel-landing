'use client';

import type { FocusEvent } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

/** How long each way in stays at the front. */
export const WAY_MS = 3000;

/** How long a card takes to come forward or sink back. */
const MOVE_MS = 700;
const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)';

export type WayLink = {
  readonly name: string;
  readonly button: string;
  readonly href: string;
  readonly external: boolean;
};

type Role = 'front' | 'gone' | 'coming';

/**
 * Where a card is in the cycle. `coming` waits in front of the panel, large and clear
 * of view; `front` is the one to read and click; `gone` has sunk back into the panel.
 */
const ROLE_STYLE: Record<Role, { transform: string; opacity: number; filter: string }> = {
  coming: { transform: 'translateZ(220px) translateY(10px)', opacity: 0, filter: 'blur(6px)' },
  front: { transform: 'translateZ(0) translateY(0)', opacity: 1, filter: 'none' },
  gone: { transform: 'translateZ(-260px) translateY(-18px)', opacity: 0, filter: 'blur(4px)' },
};

/** Fine grain over the gradient, as an SVG noise tile. */
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>'
)}")`;

export type WaysInPanelProps = {
  readonly ways: readonly WayLink[];
  /** Which way is at the front. */
  readonly active: number;
  /** Reduced motion: all three show as a still list. */
  readonly reduced: boolean;
  readonly onHold: (held: boolean) => void;
  readonly onFocusWay: (index: number) => void;
};

/**
 * The narrow panel of the card: a grainy gradient where the three ways in take turns,
 * each coming forward, holding for three seconds, then sinking back as the next one
 * comes. Hovering the panel, or focusing a link in it, holds the one at the front.
 */
export function WaysInPanel({ ways, active, reduced, onHold, onFocusWay }: WaysInPanelProps) {
  const roleOf = (i: number): Role => {
    if (i === active) return 'front';
    return i === (active - 1 + ways.length) % ways.length ? 'gone' : 'coming';
  };

  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onHold(false);
  };

  return (
    <Box
      onMouseEnter={() => onHold(true)}
      onMouseLeave={() => onHold(false)}
      onBlur={onBlur}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 200, md: '100%' },
        backgroundColor: '#9ec5f5',
        backgroundImage: [
          GRAIN,
          'radial-gradient(90% 55% at 70% 92%, rgba(103,232,249,0.95), transparent 70%)',
          'radial-gradient(120% 60% at 30% 70%, rgba(59,130,246,0.9), transparent 70%)',
          'radial-gradient(140% 35% at 50% 32%, rgba(255,255,255,0.95), transparent 70%)',
          'linear-gradient(180deg, #b4b8f5 0%, #dfe3ff 22%, #f4fbff 34%, #9cc8f2 55%, #4f8fe0 78%, #6ad7e8 100%)',
        ].join(','),
        backgroundSize: '160px 160px, auto, auto, auto, auto',
        backgroundBlendMode: 'overlay, normal, normal, normal, normal',
      }}
    >
      <Box
        component="ul"
        sx={{
          listStyle: 'none',
          m: 0,
          p: reduced ? '24px 16px' : 0,
          position: reduced ? 'relative' : 'absolute',
          inset: 0,
          display: reduced ? 'grid' : 'block',
          gap: '12px',
          alignContent: 'center',
          perspective: '700px',
        }}
      >
        {ways.map((way, i) => {
          const role = roleOf(i);
          const style = ROLE_STYLE[role];
          return (
            <Box
              component="li"
              key={way.href}
              sx={
                reduced
                  ? { display: 'flex', justifyContent: 'center' }
                  : {
                      position: 'absolute',
                      inset: 0,
                      display: 'grid',
                      placeItems: 'center',
                      px: '12px',
                      pointerEvents: role === 'front' ? 'auto' : 'none',
                    }
              }
              style={
                reduced
                  ? undefined
                  : {
                      transform: style.transform,
                      opacity: style.opacity,
                      filter: style.filter,
                      // A card that has sunk back jumps to the front unseen.
                      transition:
                        role === 'coming'
                          ? 'none'
                          : `transform ${MOVE_MS}ms ${EASE}, opacity ${MOVE_MS}ms ease, filter ${MOVE_MS}ms ease`,
                    }
              }
            >
              <Box
                sx={{ display: 'grid', justifyItems: 'center', gap: '10px', textAlign: 'center' }}
              >
                {reduced ? null : (
                  <Box
                    component="span"
                    aria-hidden="true"
                    sx={{ fontSize: '12px', fontWeight: 600, color: 'rgba(10,20,40,0.7)' }}
                  >
                    {way.name}
                  </Box>
                )}
                <Box
                  component="a"
                  href={way.href}
                  // Tabbing to a way brings it to the front and holds it there.
                  onFocus={(event: FocusEvent<HTMLElement>) => {
                    if (event.currentTarget.matches(':focus-visible')) {
                      onFocusWay(i);
                      onHold(true);
                    }
                  }}
                  {...(way.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    height: 38,
                    px: '16px',
                    borderRadius: '999px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                    bgcolor: '#fff',
                    color: '#0A0A0F',
                    boxShadow:
                      '0 1px 2px rgba(10,20,40,0.08), 0 10px 24px -10px rgba(10,20,40,0.35)',
                    transition: 'transform 150ms',
                    '&:hover': { transform: 'translateY(-1px)' },
                    '&:focus-visible': { outline: '2px solid #0A0A0F', outlineOffset: '3px' },
                  }}
                >
                  {way.button}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Which of the three is at the front. */}
      {reduced ? null : (
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 16,
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          {ways.map((way, i) => (
            <Box
              key={way.href}
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: i === active ? 'rgba(10,20,40,0.75)' : 'rgba(10,20,40,0.2)',
                width: i === active ? 16 : 4,
                transition: 'width 300ms ease, background-color 300ms ease',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
