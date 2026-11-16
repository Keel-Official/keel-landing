'use client';

import type { DepthPanel } from '@/lib/keel/landing/story';

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import { VIEW } from './stage-kit';
import { SceneDepth } from './scenes/scene-3-depth';
import { SceneOffers } from './scenes/scene-2-offers';
import { SceneLimits } from './scenes/scene-6-limits';
import { SceneLending } from './scenes/scene-4-lending';
import { SceneIncident } from './scenes/scene-5-incident';
import { SceneLastTrade } from './scenes/scene-1-last-trade';

import type { SceneProps } from './stage-kit';

// ----------------------------------------------------------------------

const FADE_MS = 450;

const IDLE: SceneProps = { beat: 0, elapsed: 0, instant: true };

export interface StoryStageProps {
  readonly step: number;
  readonly beat: number;
  readonly elapsed: number;
  /** Reduced motion: scenes show their final frame and switch without fading. */
  readonly reduced: boolean;
  readonly depth: readonly [DepthPanel, DepthPanel];
}

/**
 * The stage beside the steps: one scene per step, stacked. The open step's scene plays
 * from the story clock; the one it replaced holds its last frame while it fades out;
 * the rest wait at their start, reset without transitions, so each plays from the top
 * when it opens again. Hidden from assistive tech: the step text says the same thing.
 */
export function StoryStage({ step, beat, elapsed, reduced, depth }: StoryStageProps) {
  // The open scene's latest frame, kept so it can hold still while it fades out.
  const latest = useRef<{ step: number; frame: SceneProps }>({ step, frame: IDLE });
  const [leaving, setLeaving] = useState<{ step: number; frame: SceneProps } | null>(null);

  useEffect(() => {
    const before = latest.current;
    if (before.step !== step) {
      setLeaving({ step: before.step, frame: { ...before.frame, instant: true } });
    }
    latest.current = { step, frame: { beat, elapsed, instant: reduced } };
  }, [step, beat, elapsed, reduced]);

  useEffect(() => {
    if (!leaving) return undefined;
    const timer = window.setTimeout(() => setLeaving(null), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  const frameOf = (n: number): SceneProps => {
    if (n === step) return { beat, elapsed, instant: reduced };
    if (n === leaving?.step) return leaving.frame;
    return IDLE;
  };

  const sceneOf = (n: number, frame: SceneProps) => {
    switch (n) {
      case 1:
        return <SceneLastTrade {...frame} />;
      case 2:
        return <SceneOffers {...frame} />;
      case 3:
        return <SceneDepth {...frame} depth={depth} />;
      case 4:
        return <SceneLending {...frame} />;
      case 5:
        return <SceneIncident {...frame} />;
      default:
        return <SceneLimits {...frame} />;
    }
  };

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'relative',
        containerType: 'inline-size',
        aspectRatio: `${VIEW.width} / ${VIEW.height}`,
        borderRadius: { xs: 0, sm: '18px', md: '22px' },
        bgcolor: '#F4F5F7',
        backgroundImage: 'radial-gradient(rgba(10,10,15,0.09) 1px, transparent 1.2px)',
        backgroundSize: '16px 16px',
        backgroundPosition: '8px 8px',
        overflow: 'hidden',
        '@keyframes psPing': {
          from: { opacity: 0.7, transform: 'scale(1)' },
          to: { opacity: 0, transform: 'scale(2.6)' },
        },
      }}
    >
      {[1, 2, 3, 4, 5, 6].map((n) => {
        const active = n === step;
        const visible = active || (!reduced && n === leaving?.step);
        return (
          <Box
            key={n}
            sx={{ position: 'absolute', inset: 0 }}
            style={{
              opacity: active ? 1 : 0,
              filter: active ? 'none' : 'blur(5px)',
              transition: reduced ? 'none' : `opacity ${FADE_MS}ms ease, filter ${FADE_MS}ms ease`,
              visibility: visible ? 'visible' : 'hidden',
            }}
          >
            {sceneOf(n, frameOf(n))}
          </Box>
        );
      })}
    </Box>
  );
}
