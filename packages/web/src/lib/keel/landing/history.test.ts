import { historyLine } from './history';
import { ustryHistory } from '../fixtures';
import { formatDay } from '../format/staleness';

// Ported from keel-frontend tests/hero-history.test.ts (vitest to jest). Next's server
// build provides React's `cache`; plain React 18 in jest does not, so it passes through.
jest.mock('react', () => ({ ...jest.requireActual('react'), cache: (fn: unknown) => fn }));

describe('hero history mapping', () => {
  it('maps every saved reading into the viewBox, broken at the gap the engine reports', () => {
    const line = historyLine(ustryHistory, false);
    const drawn = line.points.filter((point) => point !== null);
    expect(drawn.length).toBe(line.drawn);
    for (const point of drawn) {
      expect(point.x).toBeGreaterThanOrEqual(0);
      expect(point.x).toBeLessThanOrEqual(400);
      expect(point.y).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeLessThanOrEqual(100);
    }
    const breaks = line.points.filter((point) => point === null).length;
    expect(breaks).toBeGreaterThanOrEqual(ustryHistory.gaps?.length ? 1 : 0);
  });

  it('breaks the line at an unknown value instead of drawing a zero', () => {
    const points = ustryHistory.points.map((point, index) =>
      index === 5 ? { ...point, maxSafeCollateral: null } : point
    );
    const line = historyLine({ ...ustryHistory, gaps: [], points }, false);
    expect(line.points.filter((point) => point === null)).toHaveLength(1);
    expect(line.drawn).toBe(ustryHistory.points.length - 1);
  });

  it('dates the span from the readings themselves', () => {
    const line = historyLine(ustryHistory, false);
    expect(line.firstAt).toBe(ustryHistory.points[0].ledgerClosedAt);
    expect(formatDay(line.firstAt)).toBe('19 October 2026');
    expect(formatDay(line.lastAt)).toBe('13 November 2026');
  });
});
