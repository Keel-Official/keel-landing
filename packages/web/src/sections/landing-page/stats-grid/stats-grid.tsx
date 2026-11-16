'use client';

import * as React from 'react';
import { fill } from '@/lib/keel/format/fill';

import Box from '@mui/material/Box';

import { COPY, LINKS } from '../copy';
import { GridFloor } from './grid-floor';
import { WAY_MS, WaysInPanel } from './ways-in-panel';

// ----------------------------------------------------------------------

const MONO = {
  fontFamily: '"Geist Mono", ui-monospace, monospace',
  fontFeatureSettings: '"ss01","ss02","zero"',
  fontVariantNumeric: 'tabular-nums',
} as const;

/** The MCP command, with a control that copies it. */
function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = COPY.waysIn;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        pl: '12px',
        pr: '6px',
        py: '6px',
      }}
    >
      <Box
        component="code"
        sx={{ ...MONO, fontSize: '13px', color: '#fff', flex: 1, minWidth: 0, overflowX: 'auto' }}
      >
        {command}
      </Box>
      <Box
        component="button"
        type="button"
        onClick={onCopy}
        aria-live="polite"
        sx={{
          flexShrink: 0,
          cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.16)',
          borderRadius: '8px',
          background: 'transparent',
          color: 'rgba(255,255,255,0.85)',
          fontSize: '12px',
          fontWeight: 500,
          px: '10px',
          py: '4px',
          '&:hover': { background: 'rgba(255,255,255,0.08)' },
        }}
      >
        {copied ? copy.copied : copy.copy}
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

/** The card's dark side and its text. */
const CARD_BG = '#151922';
const TEXT_MUTED = 'rgba(255,255,255,0.55)';

/**
 * Which way in is at the front of the panel. It moves on every `WAY_MS` and round again
 * after the last, unless held: the reader is on the panel, the card is off screen, the
 * tab is hidden, or motion is reduced.
 */
function useWayCycle(count: number) {
  const [active, setActive] = React.useState(0);
  const [held, setHeld] = React.useState(false);
  const [offscreen, setOffscreen] = React.useState(true);
  const [hidden, setHidden] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener('change', apply);
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    const el = ref.current;
    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting), {
      threshold: 0.3,
    });
    if (el) observer.observe(el);
    return () => {
      query.removeEventListener('change', apply);
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
    };
  }, []);

  const stopped = held || offscreen || hidden || reduced;

  React.useEffect(() => {
    if (stopped) return undefined;
    const timer = window.setTimeout(() => setActive((a) => (a + 1) % count), WAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, stopped, count]);

  return { ref, active, setActive, setHeld, reduced, still: offscreen || hidden || reduced };
}

// ----------------------------------------------------------------------

export type StatsGridProps = React.ComponentPropsWithoutRef<'section'> & {
  /** `total` from `/assets`, or the saved list's when the API does not answer. */
  assetCount: number;
};

/**
 * `docs/landing-copy.md` section 6: three ways in, as one dark card. The wide side
 * holds the three ways over a grid floor with running light; the narrow side is a
 * gradient panel where each way's button takes the front for three seconds, coming
 * forward and sinking back. Hovering the panel holds it.
 */
export const StatsGrid: React.FC<StatsGridProps> = ({ assetCount, ...props }) => {
  const copy = COPY.waysIn;
  const ways = [
    {
      name: copy.dashboard.name,
      body: fill(copy.dashboard.body, { assetCount }),
      button: copy.dashboard.button,
      href: LINKS.dashboard,
      external: false,
    },
    {
      name: copy.api.name,
      body: copy.api.body,
      button: copy.api.button,
      href: LINKS.apiDocs,
      external: false,
    },
    {
      name: copy.agents.name,
      body: copy.agents.body,
      command: copy.agents.command,
      button: copy.agents.button,
      href: LINKS.mcp,
      external: true,
    },
  ];
  const cycle = useWayCycle(ways.length);

  return (
    <Box
      component="section"
      aria-labelledby="ways-heading"
      {...props}
      sx={{ bgcolor: '#FAFAFB', py: { xs: '64px', md: '104px' } }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <Box
          ref={cycle.ref}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 4fr' },
            borderRadius: { xs: '20px', md: '24px' },
            overflow: 'hidden',
            bgcolor: CARD_BG,
            color: '#fff',
            boxShadow: '0 30px 60px -30px rgba(10,15,30,0.45)',
          }}
        >
          <WaysInPanel
            ways={ways}
            active={cycle.active}
            reduced={cycle.reduced}
            onHold={cycle.setHeld}
            onFocusWay={cycle.setActive}
          />

          <Box
            sx={{
              position: 'relative',
              isolation: 'isolate',
              p: { xs: '32px 24px 40px', md: '56px 56px 64px' },
              minHeight: { md: 380 },
            }}
          >
            <GridFloor paused={cycle.still} />

            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 560 }}>
              <Box
                component="h2"
                id="ways-heading"
                sx={{
                  m: 0,
                  fontSize: 'clamp(30px, 3.4vw, 44px)',
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.08,
                }}
              >
                {copy.title}
              </Box>

              <Box
                component="ul"
                sx={{ listStyle: 'none', m: 0, p: 0, mt: '28px', display: 'grid', gap: '14px' }}
              >
                {ways.map((way, i) => {
                  const on = cycle.reduced || i === cycle.active;
                  return (
                    <Box
                      component="li"
                      key={way.name}
                      sx={{
                        pl: '16px',
                        borderLeft: '2px solid',
                        transition: 'border-color 400ms ease, opacity 400ms ease',
                      }}
                      style={{
                        borderColor: on ? 'rgba(125,211,252,0.9)' : 'rgba(255,255,255,0.12)',
                        opacity: on ? 1 : 0.6,
                      }}
                    >
                      <Box
                        component="p"
                        sx={{ m: 0, fontSize: '15.5px', lineHeight: 1.55, color: TEXT_MUTED }}
                      >
                        <Box component="strong" sx={{ color: '#fff', fontWeight: 600 }}>
                          {way.name}
                        </Box>{' '}
                        {way.body}
                      </Box>
                      {way.command ? (
                        <Box sx={{ mt: '10px', maxWidth: 380 }}>
                          <CopyCommand command={way.command} />
                        </Box>
                      ) : null}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

StatsGrid.displayName = 'StatsGrid';
