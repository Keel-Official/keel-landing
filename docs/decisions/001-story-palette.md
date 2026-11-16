# DEC-001: A separate illustration palette for "Price is not liquidity"

Status: accepted by Al, 2026-11-16. Tokens added to `src/lib/keel/design/tokens.css`.

## Context

Section 2 of the landing page, "Price is not liquidity", is an animated illustration of
how a price, the offers behind it, and a loan relate. It needs to tell apart four things
on one stage: the price, the liquidity behind it, the sell side (and the manipulation
limit), and a pushed price with what follows from it.

The approved motion prototype (`docs/design/prototypes/keel-story-prototype.html`) does
this with four hues. None of them exists in `src/lib/keel/design/tokens.css`, which so
far only holds the four risk bands.

## Decision

Add four story tokens, for illustration only:

| Token             | Value     | Role                                              |
| ----------------- | --------- | ------------------------------------------------- |
| `--story-price`   | `#3b82f6` | The price and its trace                           |
| `--story-depth`   | `#06b6d4` | Liquidity: buy offers, depth inside a range       |
| `--story-sell`    | `#8b5cf6` | Sell side, manipulation limit                     |
| `--story-pushed`  | `#d946ef` | A pushed price and its consequences (the loan)    |

Pale gradient ends and tints are the same four values at lower opacity, not new values.

## Why they are separate from the band tokens

- A band colour means a finding about a real asset. Nothing on this stage is a finding:
  it is a diagram with no data except step 3's depth values. If the stage drew in band
  colours, a reader would take a violet bar for "HIGH" or a green one for "LOW".
- So the story palette avoids the hue families the bands own (red, orange, amber,
  yellow, green) and the band tokens never appear in this section.
- Keeping them as their own named tokens, instead of literals in the components, makes
  the rule checkable: a band token in `price-story/` or a story token outside it is a
  review error.

## Consequences

- `--story-*` is used by `src/sections/landing-page/price-story/` and nowhere else.
- The values are only light-theme checked, like the band tokens in this repo.
- Not validated with keel-frontend's `check-token-contrast.mjs`: these are marks on a
  white stage, never text. Text on the stage stays in the section's ink and muted
  colours.

## Colour-vision check (2026-11-16)

Run through the dataviz palette validator on the light surface: lightness and chroma
pass; `--story-depth` is under 3:1 against the surface; `--story-sell` and
`--story-pushed` are too close for protan vision (ΔE 1.3) and only just apart for
normal vision (ΔE 14.1). So no story colour carries meaning alone: every mark on the
stage is labelled directly, and the pushed state is also dashed or outlined.
