import { ustryDepth } from '../fixtures';
import { depthRoles, depthPanels } from './story';

import type { DepthPanel } from './story';

/** Whole units of a decimal string, exact, for an ordering check only. */
const whole = (value: string) => BigInt(value.split('.')[0]);

describe('depth step', () => {
  it('reads 2%, 5% and 10% sell-side depth of USTRY and XLM from the saved responses', () => {
    const [ustry, xlm] = depthPanels();
    expect(ustry.code).toBe('USTRY');
    expect(xlm.code).toBe('XLM');
    expect(ustry.rungs.map((r) => r.label)).toEqual(['2%', '5%', '10%']);
    expect(ustry.rungs[1].display).toBe('260,649.22 USDC');
    expect(xlm.rungs[1].display).toBe('91,490.48 USDC');
  });

  it('keeps the served string and cuts the display without rounding', () => {
    const [ustry] = depthPanels();
    const served = ustryDepth.depth.find((row) => row.delta === 0.02)!.sellSide;
    expect(ustry.rungs[0].exact).toBe(served);
    expect(ustry.rungs[0].display).toBe('260,544.98 USDC');
  });

  it('carries ledger and methodology for each panel', () => {
    for (const p of depthPanels()) {
      expect(p.ledgerSeq).toBeGreaterThan(0);
      expect(p.methodologyVersion).not.toBe('');
    }
  });

  it('puts the deeper market at 5% in the deep slot', () => {
    const [deep, thin] = depthPanels();
    expect(whole(deep.rungs[1].exact!) > whole(thin.rungs[1].exact!)).toBe(true);
  });

  it('fills the step 3 sentence from the 5% rung', () => {
    expect(depthRoles(depthPanels())).toEqual({
      deepAsset: 'USTRY',
      deepAmount: '260,649.22 USDC',
      thinAsset: 'XLM',
      thinAmount: '91,490.48 USDC',
    });
  });

  it('shows a missing 5% rung as unknown, never as 0', () => {
    const [deep, thin] = depthPanels();
    const noRung: DepthPanel = {
      ...thin,
      rungs: thin.rungs.map((r) => (r.label === '5%' ? { ...r, display: null, exact: null } : r)),
    };
    expect(depthRoles([deep, noRung]).thinAmount).toBe('unknown');
  });
});
