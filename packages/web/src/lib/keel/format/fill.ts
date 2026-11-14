/**
 * Fills `{name}` placeholders in a landing copy line from the payload. A placeholder
 * with no value is left as written, so a missing field shows up on the page instead of
 * disappearing.
 *
 * Its own module with no imports, so a client component can use it without pulling
 * either language's copy into the browser bundle.
 */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  );
}
