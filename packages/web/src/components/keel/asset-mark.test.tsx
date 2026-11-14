/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';

import { existsSync } from 'node:fs';
import { render } from '@testing-library/react';
import { assetIcon } from '@/lib/keel/assets/icons';

import { AssetMark, isNativeXlm } from './asset-mark';

// Ported from keel-frontend tests/asset-mark.test.tsx (vitest to jest).

const ISSUER = 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN';

describe('AssetMark (DEC-007)', () => {
  it('renders the Stellar mark for native XLM', () => {
    const { container } = render(<AssetMark code="XLM" issuer={null} />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-native', 'true');
    expect(container.querySelector('img')).toHaveAttribute('src', '/brand/stellar-mark.png');
  });

  it('renders a stored icon only for the exact code and issuer', () => {
    const ustry = 'GCRYUGD5NVARGXT56XEZI5CIFCQETYHAPQQTHO2O3IQZTHDH4LATMYWC';
    const { container } = render(<AssetMark code="USTRY" issuer={ustry} />);
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      '/brand/assets/ustry-gcryugd5.png'
    );
    // The same code from another issuer is another asset, and keeps the monogram.
    const copycat = render(<AssetMark code="USTRY" issuer={ISSUER} />);
    expect(copycat.container.querySelector('img')).toBeNull();
    expect(copycat.container.firstElementChild).toHaveTextContent('US');
  });

  it('points every stored icon at a file that exists', () => {
    for (const [code, issuer] of [
      ['XLM', null],
      ['USTRY', 'GCRYUGD5NVARGXT56XEZI5CIFCQETYHAPQQTHO2O3IQZTHDH4LATMYWC'],
      ['THE1', 'GBGRBCUB6L7LH4JQ6EPDP7REH2DDACMCUQI76M3P6DM52QWU2Z5LIEVW'],
    ] as const) {
      const icon = assetIcon(code, issuer)!;
      expect(existsSync(`public${icon.src}`)).toBe(true);
      expect(icon.source).not.toBe('');
    }
  });

  it('treats an issued asset coded XLM as an ordinary asset', () => {
    expect(isNativeXlm('XLM', ISSUER)).toBe(false);
    const { container } = render(<AssetMark code="XLM" issuer={ISSUER} />);
    const root = container.firstElementChild!;
    expect(root).toHaveTextContent('XL');
    expect(root).not.toHaveAttribute('data-native');
    expect(container.querySelector('img')).toBeNull();
  });

  it('keeps the case of the code', () => {
    const { container } = render(<AssetMark code="yUSDC" issuer={ISSUER} />);
    expect(container.firstElementChild!.textContent).toBe('yU');
  });

  it('renders a one-character code as that one character', () => {
    const { container } = render(<AssetMark code="Z" issuer={ISSUER} />);
    expect(container.firstElementChild!.textContent).toBe('Z');
  });

  it('is hidden from assistive technology', () => {
    const { container } = render(<AssetMark code="EURC" issuer={ISSUER} />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});
