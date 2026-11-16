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
  meta: {
    title: 'Keel | Liquidity risk intelligence for Stellar',
  },
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
        /** [Validate] What the dot is doing, shown when the visual ends. */
        dot: 'The price: what someone just paid.',
      },
      {
        title: 'What matters is what stands behind it.',
        body: 'Behind every price on Stellar are open offers to buy and sell, in the order book and in liquidity pools. The more of them there are, the harder the price is to move.',
        /** [Validate] What the dot is doing, shown when the visual ends. */
        dot: 'The price, held up by the offers around it.',
      },
      {
        title: 'Some markets are a slope. Some are a cliff.',
        body: '{deepAsset} can absorb {deepAmount} of selling before its price drops 5%. {thinAsset} can absorb {thinAmount}.',
        /** [Validate] What the dot is doing, shown when the visual ends. */
        dot: 'The line: {range} below the price.',
      },
      {
        title: 'Lending apps trust the price.',
        body: 'A lending app values your collateral at the price it sees. If that price is cheap to push up, someone can borrow far more than their collateral is really worth.',
        /** [Validate] What the dot is doing, shown when the visual ends. */
        dot: 'Pushed up, then back. The loan stays out.',
      },
      {
        title: 'It happened on Stellar.',
        // The deck's `{incident figure}` slot is dropped until the exploit ledger is confirmed.
        body: 'On 22 February 2026, USTRY, a thinly traded token, was pushed to roughly 100 times its price and used as collateral on Blend.',
        /** [Validate] What the dot is doing, shown when the visual ends. */
        dot: 'USTRY, pushed to roughly 100 times its price.',
      },
      {
        title: 'Keel measures the market behind the price.',
        body: "Every 15 minutes, Keel reads Stellar's order books and liquidity pools and works out two limits. The selling limit: how much collateral the market can absorb in a forced sale. The manipulation limit: the point where pushing the price up costs less than the loan it would unlock. The lower of the two is the safe collateral size.",
        /** [Validate] What the dot is doing, shown when the visual ends. */
        dot: 'The lower limit: the safe collateral size.',
      },
    ],
    position: 'Step {n} of 6',
    /** Words drawn on the stage. From the steps above and the approved prototype. */
    stage: {
      lastTrade: 'Last trade',
      nextTrade: 'Next trade',
      price: 'Price',
      offersToBuy: 'Offers to buy',
      offersToSell: 'Offers to sell',
      orderBook: 'Order book',
      liquidityPools: 'Liquidity pools',
      sellingAt: 'Selling it can absorb',
      ledgerLine: 'Ledger {ledger}. Methodology {methodology}.',
      unknown: 'unknown',
      lendingApp: 'Lending app',
      collateralValue: 'Collateral value',
      loan: 'Loan',
      incidentDate: '22 February 2026',
      incidentAsset: 'USTRY',
      incidentVenue: 'Blend',
      every15: 'Every 15 minutes',
      sellingLimit: 'Selling limit',
      manipulationLimit: 'Manipulation limit',
      safeSize: 'Safe collateral size',
      illustration: 'Illustration, not data.',
      /** [Validate] Under step 3's bars. */
      sketch: 'Bar shapes sketch the saved readings, not to scale.',
    },
    pause: 'Pause the story',
    play: 'Play the story',
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
    /** Spec wording (Al, 16 November 2026). Not in docs/landing-copy.md. */
    showEvidence: 'Show the evidence',
    /** [Validate] The rest below are labels the charts need; not in docs/landing-copy.md. */
    hideEvidence: 'Hide the evidence',
    chartLabel: 'Band of {code} over time',
    tableCaption: 'Band of {code} at each recorded reading',
    columns: ['Date', 'Band', 'Ledger', 'Methodology', 'Confidence'],
    confidence: 'Confidence {confidence}',
    unknown: 'unknown',
    noPrice: 'No price.',
    noRecording: 'No recording',
    methodologyChange: 'Methodology {methodology}',
    depthTitle: 'Sell-side depth, {quote}',
    depthLabel: 'Depth within {delta}',
    /** [Validate] Section 3's chart redraws on a loop, like the story (Al, 16 November 2026). */
    pauseChart: 'Pause the chart',
    playChart: 'Play the chart',
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
  /** Section 6. The deck's "no sign-up" wording is left out. */
  waysIn: {
    title: 'Three ways in',
    dashboard: {
      name: 'Dashboard.',
      body: 'Browse the {assetCount} Stellar assets Keel monitors.',
      button: 'Open the dashboard',
    },
    api: {
      name: 'API.',
      body: 'Read-only JSON over HTTPS.',
      button: 'Read the API docs',
    },
    agents: {
      name: 'AI agents.',
      body: "Ask Claude, Cursor or any MCP client, and get Keel's own numbers back.",
      command: 'npx -y @keel-official/mcp',
      button: 'Set up keel-mcp',
    },
    /** Not in the deck: the copy control beside the command (keel-frontend en.ts). */
    copy: 'Copy',
    copied: 'Copied',
  },
  /** FAQ. Appended to docs/landing-copy.md with its [Validate] and [Al writes] markers. */
  faq: {
    title: 'Frequently asked',
    questions: [
      {
        title: 'What is Keel?',
        answer:
          "Keel measures how much real trading stands behind a token's price on Stellar, and how much of that token the market can back as loan collateral.",
      },
      {
        title: 'Is Keel a price oracle?',
        answer:
          'No. An oracle tells you what the price is. Keel tells you how much can be traded at that price before it breaks.',
      },
      {
        title: 'Does Keel tell me what to buy or sell?',
        answer: 'No. Keel reports liquidity. The lender decides. It is not investment advice.',
      },
      {
        title: 'What does each band mean?',
        answer: 'TODO(copy)',
      },
      {
        title: 'Why can a token with a normal-looking price be CRITICAL?',
        answer:
          'A price can come from one small trade. If almost nothing is on offer behind that price, it is cheap to move, and Keel marks the token CRITICAL. A token with no real trading at all is also CRITICAL.',
      },
      {
        title: 'How often is Keel updated?',
        answer:
          'Every 15 minutes. Each reading shows the ledger it was taken at and how old it is.',
      },
      {
        title: 'What does Keel cover?',
        answer:
          "Liquidity on Stellar only: the built-in order book and liquidity pools. Deep markets on other exchanges don't count here.",
      },
      {
        title: 'Do I need an account or a wallet?',
        answer: 'No. Keel is read-only. It never holds keys or moves funds.',
      },
      {
        title: 'How can I check a number myself?',
        answer:
          'Every number carries the ledger it was read at and the methodology version that produced it, so anyone can reproduce it.',
      },
    ],
  },
  /** Section 7. */
  closing: {
    title: 'Check the market behind the price.',
    primaryCta: 'Check an asset',
    secondaryCta: 'Read the methodology',
    footerLines: [
      'Keel reports liquidity. The lender decides.',
      'Not an oracle. Not investment advice.',
    ],
  },
  footer: {
    links: [
      ['Dashboard', LINKS.dashboard],
      ['API docs', LINKS.apiDocs],
      ['Methodology', LINKS.methodology],
      ['GitHub', LINKS.github],
      ['keel-mcp', LINKS.mcp],
    ] as [string, string][],
  },
} as const;
