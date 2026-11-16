import { glanceReadings } from './glance';
import { bandChart, bandLevel } from './glance-chart';
import { ustryDepth, ustryHistory } from '../fixtures';

import type { AssetRisk, HistoryResponse } from '../api/types';

// Next's server build provides React's `cache`; plain React 18 in jest does not.
jest.mock('react', () => ({ ...jest.requireActual('react'), cache: (fn: unknown) => fn }));

const point = (ledgerSeq: number, at: string, band: AssetRisk['band']) => ({
  ledgerSeq,
  ledgerClosedAt: at,
  band,
  flags: [],
});

const history = (points: ReturnType<typeof point>[], gaps: HistoryResponse['gaps'] = []) =>
  ({ ...ustryHistory, methodologyVersion: '1.0.8-draft', points, gaps }) as HistoryResponse;

const current = (over: Partial<AssetRisk>): AssetRisk => ({ ...ustryDepth, ...over });

describe('glance readings', () => {
  it('sorts history by ledger and appends the newer current reading last', () => {
    const h = history([
      point(30, '2026-11-03T00:00:00Z', 'HIGH'),
      point(10, '2026-11-01T00:00:00Z', 'LOW'),
    ]);
    const g = glanceReadings(h, current({ ledgerSeq: 40, band: 'CRITICAL' }), '1.0.8-draft', true);
    expect(g.readings.map((r) => r.ledgerSeq)).toEqual([10, 30, 40]);
    expect(g.readings.at(-1)).toMatchObject({ current: true, band: 'CRITICAL' });
  });

  it('carries confidence and price source only on the current reading, never invented', () => {
    const h = history([point(10, '2026-11-01T00:00:00Z', 'HIGH')]);
    const g = glanceReadings(
      h,
      current({ ledgerSeq: 20, bandConfidence: 'partial', priceSource: 'none', band: 'CRITICAL' }),
      '1.0.8-draft',
      true
    );
    expect(g.readings[0]).toMatchObject({ confidence: null, priceSource: null });
    expect(g.readings[1]).toMatchObject({ confidence: 'partial', priceSource: 'none' });
  });

  it('does not draw the current reading twice when history already reaches it', () => {
    const h = history([point(50, '2026-11-01T00:00:00Z', 'HIGH')]);
    const g = glanceReadings(
      h,
      current({ ledgerSeq: 50, bandConfidence: 'partial' }),
      '1.0.8-draft',
      true
    );
    expect(g.readings).toHaveLength(1);
    expect(g.readings[0]).toMatchObject({ current: true, confidence: 'partial' });
  });
});

describe('band chart', () => {
  it('puts LOW at the bottom and CRITICAL at the top', () => {
    expect(bandLevel('LOW')).toBeGreaterThan(bandLevel('MEDIUM'));
    expect(bandLevel('HIGH')).toBeGreaterThan(bandLevel('CRITICAL'));
  });

  it('runs from the first reading to the last, never before the first', () => {
    const g = glanceReadings(
      history([point(10, '2026-11-01T00:00:00Z', 'LOW'), point(20, '2026-11-03T00:00:00Z', 'LOW')]),
      current({ ledgerSeq: 5 }),
      '1.0.8-draft',
      true
    );
    const chart = bandChart(g.readings, g.gaps);
    expect(chart.points.map((p) => p.x)).toEqual([0, 1]);
  });

  it('breaks the line at a reported gap instead of bridging it', () => {
    const g = glanceReadings(
      history(
        [
          point(10, '2026-11-01T00:00:00Z', 'HIGH'),
          point(20, '2026-11-02T00:00:00Z', 'HIGH'),
          point(90, '2026-11-09T00:00:00Z', 'LOW'),
        ],
        [{ from: 20, to: 90, reason: 'no result was recorded between these ledgers' }]
      ),
      current({ ledgerSeq: 1 }),
      '1.0.8-draft',
      true
    );
    const chart = bandChart(g.readings, g.gaps);
    expect(chart.runs).toHaveLength(1);
    expect(chart.gaps).toHaveLength(1);
    expect(chart.risers).toHaveLength(0);
  });

  it('marks a change of methodology version at the first reading under the new one', () => {
    const g = glanceReadings(
      history([point(10, '2026-11-01T00:00:00Z', 'HIGH')]),
      current({ ledgerSeq: 20, ledgerClosedAt: '2026-11-02T00:00:00Z' }),
      '1.0.9',
      true
    );
    const chart = bandChart(g.readings, g.gaps);
    expect(chart.rules).toEqual([{ x: 1, version: '1.0.9' }]);
  });

  it('labels at most four dates, first and last included', () => {
    const g = glanceReadings(ustryHistory, current({ ledgerSeq: 1 }), '1.0.8-draft', false);
    const chart = bandChart(g.readings, g.gaps);
    expect(chart.ticks.length).toBeLessThanOrEqual(4);
    expect(chart.ticks[0].x).toBe(0);
    expect(chart.ticks.at(-1)?.x).toBe(1);
  });
});
