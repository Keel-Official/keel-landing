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
  /** Section 2. */
  story: {
    title: 'Price is not liquidity',
    steps: [
      {
        title: 'A price is only the last trade.',
        body: 'It tells you what someone just paid. It does not tell you what the next seller will get.',
      },
      {
        title: 'What matters is what stands behind it.',
        body: 'Behind every price on Stellar are open offers to buy and sell, in the order book and in liquidity pools. The more of them there are, the harder the price is to move.',
      },
      {
        title: 'Some markets are a slope. Some are a cliff.',
        body: '{deepAsset} can absorb {deepAmount} of selling before its price drops 5%. {thinAsset} can absorb {thinAmount}.',
      },
      {
        title: 'Lending apps trust the price.',
        body: 'A lending app values your collateral at the price it sees. If that price is cheap to push up, someone can borrow far more than their collateral is really worth.',
      },
      {
        title: 'It happened on Stellar.',
        // The deck's `{incident figure}` slot is dropped until the exploit ledger is confirmed.
        body: 'On 22 February 2026, USTRY, a thinly traded token, was pushed to roughly 100 times its price and used as collateral on Blend.',
      },
      {
        title: 'Keel measures the market behind the price.',
        body: "Every 15 minutes, Keel reads Stellar's order books and liquidity pools and works out two limits. The selling limit: how much collateral the market can absorb in a forced sale. The manipulation limit: the point where pushing the price up costs less than the loan it would unlock. The lower of the two is the safe collateral size.",
      },
    ],
    position: 'Step {n} of 6',
  },
  /** Section 3. */
  glance: {
    title: 'One word first. The evidence when you want it.',
    body: 'Every asset gets a band and one plain sentence. Open it to see the numbers behind the sentence.',
    /** [Al writes] one plain sentence per band, from docs/methodology. */
    bandLine: 'TODO(copy): one plain sentence for {band}',
    notes: [
      "Partial confidence means some checks couldn't run. The real band can only be the same or worse.",
      'No price at all is a finding, not an error. Keel marks it CRITICAL.',
    ],
    ledger: 'Ledger {ledger}',
    methodology: 'Methodology {methodology}',
  },
  /** Section 4. */
  checked: {
    title: 'Built to be checked',
    reproducible:
      'Every number carries the ledger it was read at and the methodology version that produced it, so anyone can reproduce it.',
    unknownTitle: 'Unknown means unknown.',
    unknownBody: "If Keel can't measure something, it says so instead of showing zero.",
    listed: "Checks that couldn't run are listed, not hidden.",
    rest: [
      "Keel's thresholds are chosen, not yet calibrated against past incidents, and the methodology says so.",
      "Keel measures liquidity on Stellar only. Deep markets on other exchanges don't count here.",
      'Read-only, always. Keel never holds keys or moves funds.',
    ],
  },
  /** Section 5. [Al confirms] the list. */
  audiences: {
    title: 'For anyone who lends against a price',
    items: [
      ['Pool creators.', 'Check a token before you accept it as collateral.'],
      ['Depositors.', 'Look up the assets a lending pool accepts before you put money in.'],
      ['Lending protocols.', 'Set your collateral caps beside what the market can absorb.'],
      ['Researchers.', 'Replay any asset at a past ledger.'],
    ] as [string, string][],
  },
} as const;
