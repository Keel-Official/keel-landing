# DEC-002: A decimal library for chart geometry only

Status: proposed, 2026-11-16. Waiting for Al's approval. Until it is approved, Chart B
in section 3 shows its three rungs as a labelled list of strings, not a chart.

## Context

Section 3, "Read Keel at a glance", has a second chart behind "Show the evidence":
the sell-side depth at the API's three rungs (2%, 5%, 10%), on a Y axis in the quote
asset. The API sends each depth as a decimal string with up to fifty digits after the
point, for example `260544.98165543240482718935715435970540316464990410387`.

The frontend rules keep money as strings: no `parseFloat`, `Number()` or unary `+` on
a money value, and no rounding, summing or comparing of figures in the browser. Placing
a bar or a point at a height proportional to a depth needs arithmetic on those strings:
a ratio of each value to the axis maximum. That arithmetic is not allowed today, and
`Number()` would silently lose precision on these values.

keel-frontend already depends on `decimal.js` (^10.6.0), and its `lib/keel/chart/geometry.ts`
`plotSeries` is "the one place a served decimal becomes a number, for geometry only".
keel-landing has a copy of that mapper but not the dependency.

## Proposal

Add `decimal.js` (the version keel-frontend pins) to keel-landing, used in exactly one
module, `src/lib/keel/chart/scale.ts`, which:

- takes the depth strings of one chart and returns, for each, a position between 0 and
  1 on the Y axis (value divided by the largest value in that chart, as a `Decimal`,
  converted to a JavaScript number only at the end, as a pixel fraction);
- returns `null` for an absent value, so it is drawn as "unknown", never as 0;
- exports nothing that formats, rounds, sums, compares for display, or returns a money
  value.

The figure next to each rung is still the API's string, unchanged. The axis carries no
derived tick values: it shows the three rungs on X and, on Y, only the served strings
beside their marks, so no rounded or computed figure ever reaches the reader.

## Rules that come with it

1. `decimal.js` is imported only by `src/lib/keel/chart/scale.ts`. A lint rule
   (`no-restricted-imports`) enforces it.
2. The output of `scale.ts` is a pixel fraction and is never rendered as text.
3. Tests cover: the largest value maps to 1, an absent value maps to `null`, values with
   more than 15 significant digits keep their order.

## Alternatives considered

- **`Number()` on the strings.** Rejected: breaks the money rule and loses precision
  past 15 to 17 significant digits.
- **Server-side scaling.** Possible, since every read runs on the server, but it moves the
  same arithmetic to another file without removing it, and the chart would need two
  representations of each value.
- **No chart (the current list).** Keeps every rule with no new dependency. The cost is
  that the shape of the market, a slope or a cliff, is harder to see.

## Consequences

- One new dependency, about 32 kB minified, used only for geometry.
- Chart B can become an X/Y chart with discrete rungs and no slider.
