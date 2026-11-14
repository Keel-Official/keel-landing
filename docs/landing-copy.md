# Keel landing page copy, v1

Status: draft for review. Owner: Al. Drafted 13 November 2026.
Source of truth for landing copy. Lines marked [Validate] need Al's sign-off before they ship.

## How to read this doc

- **Goal.** After one scroll, a first-time visitor can say what Keel is and who it is for. This answers the November feedback: visitors could not tell what Keel is for from the landing page.
- **{Braces}** are data slots. Every value comes from the API, or from a fixture shaped like an API response. Never type a number by hand and never compute one in the browser.
- **[Validate]** marks a line that describes Keel's methodology. Al checks it against `docs/methodology` before it ships.
- **[Al writes]** marks a line only Al should write.
- **[Pending]** marks a fact that must be confirmed before the line can ship.

## Reference roles

| Job | Reference | What we take |
|---|---|---|
| Story | The Pudding | A step-by-step scroll story, then "explore it yourself" |
| Message | Wise | "The number you see vs what stands behind it", told with real numbers |
| Vocabulary | L2BEAT | One word first (the band), evidence on demand |
| Jargon | Nutshell | Terms that expand in place |
| Layout and motion | ctrl.xyz | Unchanged from the earlier decision |

## Copy rules

1. Sentence case everywhere. No all-caps labels above headings.
2. Never call an asset "safe". "Safe collateral size" is the name of a number, not a verdict.
3. Every number on the page shows its ledger and methodology version.
4. Unknown is shown as unknown, never as zero.
5. A plain sentence built from API fields uses the fields as they are. No rounding, no ratios, no derived figures in the browser.
6. Say "on Stellar" early. Another product called Keel exists on Solana (keel.fi).
7. Buttons say what happens: "Check an asset", not "Get started".

---

## 1. Hero

**Headline**
What can this price carry?

**Subline**
Keel measures how much real trading stands behind a token's price on Stellar, and how much of that token the market can back as loan collateral. [Validate]

**Product preview** (live reading, fixture fallback)

> {CODE} issued by {issuer domain, or shortened issuer address}
> {CODE} can back up to {maxSafeCollateral} {quote} as collateral.
> Band: {band}. Confidence: {confidence}.
> Ledger {ledgerSeq}. Methodology {methodologyVersion}. Updated {staleness} ago.

Behind the card: the asset's safe collateral history as a line that draws itself once. Label: "Safe collateral size for {CODE}, {first date} to {last date}". No value axis labels; the latest value is in the card.

Variants of the verdict line:

- `maxSafeCollateral` absent: "Keel can't size a collateral position for {CODE} yet." followed by the reason the API gives.
- Confidence partial: add "Some checks couldn't run, so the real risk may be higher." [Validate]
- `priceSource` is `none`: "No real trading supports a price for {CODE}. Keel marks this CRITICAL." [Validate]

**Buttons**
Primary: Check an asset
Secondary: See how it works

---

## 2. Price is not liquidity (how it works)

Six steps in a horizontal track, one idea per slide. The track plays on its own: each step holds for 3 seconds, then slides to the next in 0.8 seconds, and after the last it returns to the first. It holds while the reader hovers over it, waits while it is off screen or the tab is hidden, and stops while the reader focuses into it or touches it, playing again once they leave the section. The reader can still swipe, scroll sideways or use the arrow keys. With reduced motion it does not play. There are no controls. The text must make sense with motion turned off.

Each slide is named "Step {n} of 6" for screen readers.

### Step 1

**A price is only the last trade.**
It tells you what someone just paid. It does not tell you what the next seller will get.

Visual: one price number, alone on the screen.

### Step 2

**What matters is what stands behind it.**
Behind every price on Stellar are open offers to buy and sell, in the order book and in liquidity pools. The more of them there are, the harder the price is to move. [Validate]

Visual: offers stack up behind the price.

### Step 3

**Some markets are a slope. Some are a cliff.**
{deepAsset} can absorb {deepAsset depth at 5%, sell side} of selling before its price drops 5%. {thinAsset} can absorb {thinAsset depth at 5%, sell side}. [Validate]

Visual: two depth curves stepping through 2%, 5% and 10%. Discrete steps from the API's rungs only, no slider.
Data: a fixture shaped like `/asset/{assetId}/depth`, so this step still works when the API is down. Each reading shows its own ledger and methodology version.
[Pending] Which two assets. Earlier proposal: XLM and USTRY.

### Step 4

**Lending apps trust the price.**
A lending app values your collateral at the price it sees. If that price is cheap to push up, someone can borrow far more than their collateral is really worth. [Validate]

Visual: the collateral value inflates, a loan goes out, the price falls back.

### Step 5

**It happened on Stellar.**
On 22 February 2026, USTRY, a thinly traded token, was pushed to roughly 100 times its price and used as collateral on Blend. {incident figure} [Validate]

Link: Read the backtest report
[Pending] The exploit ledger. Project notes say 61,249,278; the keel-mcp README calls ledger 61,340,263 "the Blend exploit". Confirm which is the exploit ledger, and what 61,249,278 refers to, before any figure appears here.

### Step 6

**Keel measures the market behind the price.**
Every 15 minutes, Keel reads Stellar's order books and liquidity pools and works out two limits. The selling limit: how much collateral the market can absorb in a forced sale. The manipulation limit: the point where pushing the price up costs less than the loan it would unlock. The lower of the two is the safe collateral size. [Validate]

Visual: the two limits as two bars, the lower one marked.
Link: Explore it yourself (opens the dashboard)

---

## 3. Read Keel at a glance

**Headline**
One word first. The evidence when you want it.

**Body**
Every asset gets a band and one plain sentence. Open it to see the numbers behind the sentence.

**Band lines** [Al writes, from `docs/methodology`]

- LOW: {one plain sentence}
- {each other band}: {one plain sentence}
- CRITICAL: {one plain sentence}

[Pending] The full list of band names.

**Notes that always appear next to the bands** [Validate]

- Partial confidence means some checks couldn't run. The real band can only be the same or worse.
- No price at all is a finding, not an error. Keel marks it CRITICAL.

---

## 4. Built to be checked

**Headline**
Built to be checked

**Lines**

- Every number carries the ledger it was read at and the methodology version that produced it, so anyone can reproduce it.
- Unknown means unknown. If Keel can't measure something, it says so instead of showing zero.
- Checks that couldn't run are listed, not hidden.
- Keel's thresholds are chosen, not yet calibrated against past incidents, and the methodology says so. [Validate]
- Keel measures liquidity on Stellar only. Deep markets on other exchanges don't count here. [Validate]
- Read-only, always. Keel never holds keys or moves funds.

---

## 5. Who it's for

**Headline**
For anyone who lends against a price

- **Pool creators.** Check a token before you accept it as collateral.
- **Depositors.** Look up the assets a lending pool accepts before you put money in.
- **Lending protocols.** Set your collateral caps beside what the market can absorb.
- **Researchers.** Replay any asset at a past ledger.

[Al confirms] This audience list is a proposal. Remove any line Keel can't serve today.

---

## 6. Three ways in

- **Dashboard.** Browse the {assetCount} Stellar assets Keel monitors. Button: Open the dashboard
- **API.** Read-only JSON over HTTPS. Button: Read the API docs
- **AI agents.** Ask Claude, Cursor or any MCP client, and get Keel's own numbers back. `npx -y @keel-official/mcp`. Button: Set up keel-mcp

[Pending] Whether the API needs a key. Only say "no sign-up" if it doesn't.

---

## 7. Closing

**Headline**
Check the market behind the price.

Primary: Check an asset
Secondary: Read the methodology

**Footer lines**

- Keel reports liquidity. The lender decides.
- Not an oracle. Not investment advice.
- Ledger {ledgerSeq}. Methodology {methodologyVersion}. Updated {staleness} ago.

---

## Glossary (expands in place)

Each term expands inline the first time it appears on the page. All entries are [Validate].

| Term | Plain explanation |
|---|---|
| Order book | Stellar's built-in exchange (SDEX), where people leave offers to buy or sell at a set price. |
| Liquidity pool | A pool holding two tokens that trades automatically, at a price set by how much of each it holds. |
| Depth | How much can be bought or sold before the price moves by 2%, 5% or 10%. |
| Manipulation cost | What it would cost to push the price up to a given level. |
| Selling limit | How much collateral the market can absorb if it has to be sold in a liquidation. |
| Manipulation limit | The collateral size at which pushing the price up costs less than the loan it would unlock. |
| Safe collateral size | The lower of the selling limit and the manipulation limit. |
| Band | Keel's one-word risk reading for an asset. |
| Confidence | Whether every check could run. Partial means some couldn't. |
| Ledger | A numbered block of Stellar's history. Each reading names the ledger it was taken at. |
| Methodology version | The version of Keel's rules that produced a number. |

---

## Open items before this ships

1. [Pending] Exploit ledger and incident figure for step 5.
2. [Pending] Band names, then [Al writes] one sentence per band.
3. [Pending] The two assets for step 3.
4. Resolved: no key needed (checked 13 November 2026)
5. [Al confirms] The audience list in section 5.
6. Merge with the Figma landing design started on 10 November, if it exists.

---

## FAQ

**Heading**
Frequently asked

1. **What is Keel?** Keel measures how much real trading stands behind a token's price on Stellar, and how much of that token the market can back as loan collateral. [Validate]
2. **Is Keel a price oracle?** No. An oracle tells you what the price is. Keel tells you how much can be traded at that price before it breaks. [Validate]
3. **Does Keel tell me what to buy or sell?** No. Keel reports liquidity. The lender decides. It is not investment advice.
4. **What does each band mean?** `TODO(copy)` [Al writes]
5. **Why can a token with a normal-looking price be CRITICAL?** A price can come from one small trade. If almost nothing is on offer behind that price, it is cheap to move, and Keel marks the token CRITICAL. A token with no real trading at all is also CRITICAL. [Validate]
6. **How often is Keel updated?** Every 15 minutes. Each reading shows the ledger it was taken at and how old it is. [Validate]
7. **What does Keel cover?** Liquidity on Stellar only: the built-in order book and liquidity pools. Deep markets on other exchanges don't count here. [Validate]
8. **Do I need an account or a wallet?** No. Keel is read-only. It never holds keys or moves funds.
9. **How can I check a number myself?** Every number carries the ledger it was read at and the methodology version that produced it, so anyone can reproduce it. [Validate]
