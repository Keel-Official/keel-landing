/**
 * `X-Keel-Staleness-Seconds` as a duration a reader can take in: "7 seconds",
 * "3 minutes", "2 hours". Whole units only, counted down from the served value, never
 * up, so a reading is never shown as fresher than the engine says it is.
 */
export function formatStaleness(seconds: number): string {
  const units: [number, string][] = [
    [86_400, 'day'],
    [3_600, 'hour'],
    [60, 'minute'],
    [1, 'second'],
  ];
  for (const [size, name] of units) {
    const count = Math.floor(seconds / size);
    if (count >= 1) return `${count} ${name}${count === 1 ? '' : 's'}`;
  }
  return '0 seconds';
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * `2026-10-19T23:54:28Z` as `19 October 2026`, read from the string itself so no time
 * zone can move the date. An unparseable value is returned unchanged.
 */
export function formatDay(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;
  const [, year, month, day] = match;
  return `${Number.parseInt(day, 10)} ${MONTHS[Number.parseInt(month, 10) - 1]} ${year}`;
}
