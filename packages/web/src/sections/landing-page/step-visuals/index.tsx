import type { ReactNode } from 'react';

import { OffersVisual } from './offers-visual';
import { LastTradeVisual } from './last-trade-visual';

export * from './step-visual';

/**
 * Each step's illustration, by step number (1 to 6). A step without one shows its text
 * only. To add one: build it inside `step-visuals/`, drawing with `STEP_VISUAL_COLORS`
 * and timing its entrance with `usePlayOnce`, then list it here.
 */
export const STEP_VISUALS: Readonly<Partial<Record<number, ReactNode>>> = {
  1: <LastTradeVisual />,
  2: <OffersVisual />,
};
