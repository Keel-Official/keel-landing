/**
 * Every line a visitor reads on the landing page, from `docs/landing-copy.md`, word for
 * word. Placeholders in braces are filled from API payloads with `fill()`; they are never
 * typed by hand. A line the sources do not supply reads `TODO(copy)` on the page.
 *
 * The wording matches keel-frontend `lib/keel/i18n/landing/en.ts`, which is drawn from
 * the same document.
 */

/** Where the Keel site serves each page (keel-frontend `lib/dashboard.ts`, `ways-in.tsx`). */
export const LINKS = {
  dashboard: 'https://keels.app/dashboard',
  methodology: 'https://keels.app/dashboard/methodology',
  apiDocs: 'https://keels.app/evidence/keel-openapi.yaml',
  github: 'https://github.com/Keel-Official',
  mcp: 'https://www.npmjs.com/package/@keel-official/mcp',
  howItWorks: '#how-it-works',
} as const;

export const COPY = {
  nav: {
    howItWorks: 'How it works',
    dashboard: 'Dashboard',
    apiDocs: 'API docs',
    methodology: 'Methodology',
  },
  /** Section 1. */
  hero: {
    title: 'What can this price carry?',
    subline:
      "Keel measures how much real trading stands behind a token's price on Stellar, and how much of that token the market can back as loan collateral.",
    issuedBy: 'issued by',
    nativeAsset: 'Native asset',
    verdict: '{code} can back up to {amount} {quote} as collateral.',
    noCollateral: "Keel can't size a collateral position for {code} yet.",
    noPrice: 'No real trading supports a price for {code}. Keel marks this CRITICAL.',
    bandLine: 'Band: {band}. Confidence: {confidence}.',
    partial: "Some checks couldn't run, so the real risk may be higher.",
    provenance: 'Ledger {ledger}. Methodology {methodology}. Updated {staleness} ago.',
    /** A live reading that arrived without `X-Keel-Staleness-Seconds`. */
    provenanceNoStaleness: 'Ledger {ledger}. Methodology {methodology}. Staleness unknown.',
    /** Shown only when the API did not answer and the saved reading is used. */
    recorded:
      'Ledger {ledger}. Methodology {methodology}. TODO(copy): recorded reading, the live engine did not answer.',
    primaryCta: 'Check an asset',
    secondaryCta: 'See how it works',
    historyLabel: 'Safe collateral size for {code}, {first} to {last}',
  },
} as const;
