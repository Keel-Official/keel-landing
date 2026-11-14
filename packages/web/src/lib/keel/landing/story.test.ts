import { depthStep } from './story';

/** Whole units of a decimal string, exact, for an ordering check only. */
const whole = (value: string) => BigInt(value.split('.')[0]);

describe('depth step', () => {
  it('reads the 5% sell side of USTRY and XLM from the saved responses', () => {
    const { deep, thin } = depthStep();
    expect(deep.code).toBe('USTRY');
    expect(thin.code).toBe('XLM');
    expect(deep.amount).toBe('260,649.22 USDC');
    expect(thin.amount).toBe('91,490.48 USDC');
  });

  it('puts the deeper market in the deep slot', () => {
    const { deep, thin } = depthStep();
    expect(whole(deep.exact!) > whole(thin.exact!)).toBe(true);
  });
});
