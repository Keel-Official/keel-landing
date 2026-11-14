import { assetId } from '../format/decimal';

/**
 * The asset icons stored in this repository (decision 007, amended 13 November 2026).
 *
 * Keyed by the full asset id, code and issuer, never by code alone: codes collide, and
 * an asset that copies a code must not borrow its icon. Every entry says where its
 * file came from, so a reader of this file can check it. Any asset not listed here
 * keeps its monogram until the backend serves verified issuer icons.
 */
export interface AssetIcon {
  /** Path under `public/`. */
  readonly src: string;
  /** Where the file came from, and whether it has been checked against the issuer. */
  readonly source: string;
}

/** Native XLM: the official Stellar mark (decision 007, rule 2). */
export const STELLAR_MARK: AssetIcon = {
  src: '/brand/stellar-mark.png',
  source: 'Stellar mark, supplied by Al on 13 November 2026.',
};

const ICONS: Readonly<Record<string, AssetIcon>> = {
  [assetId('USTRY', 'GCRYUGD5NVARGXT56XEZI5CIFCQETYHAPQQTHO2O3IQZTHDH4LATMYWC')]: {
    src: '/brand/assets/ustry-gcryugd5.png',
    source:
      "Supplied by Al on 13 November 2026. Not yet checked against the issuer's stellar.toml.",
  },
  [assetId('THE1', 'GBGRBCUB6L7LH4JQ6EPDP7REH2DDACMCUQI76M3P6DM52QWU2Z5LIEVW')]: {
    src: '/brand/assets/the1-gbgrbcub.jpeg',
    source:
      "Supplied by Al on 13 November 2026. Not yet checked against the issuer's stellar.toml.",
  },
};

/**
 * The icon for an asset, or null for a monogram. Native XLM is the asset with no
 * issuer and the code XLM; an issued asset coded XLM is an ordinary asset.
 */
export function assetIcon(code: string, issuer: string | null): AssetIcon | null {
  if (issuer === null) return code === 'XLM' ? STELLAR_MARK : null;
  return ICONS[assetId(code, issuer)] ?? null;
}
