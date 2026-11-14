import type { Band } from '@/lib/keel/format/flags';
import type { BandToken } from '@/lib/keel/design/tokens';

import { BAND_TOKENS } from '@/lib/keel/design/tokens';

import Box from '@mui/material/Box';

/**
 * The four band icons named in `tokens.ts`, drawn inline so the page loads no icon
 * font and calls no icon service. Paths are Lucide's (ISC licence, lucide-react
 * 1.42.0, the version keel-frontend uses), copied unchanged. Colour alone never
 * carries the band, so each band has a different silhouette.
 */
const ICON_PATHS: Readonly<Record<BandToken['icon'], readonly string[]>> = {
  // Lucide draws this ring as <circle cx=12 cy=12 r=10>; BandIcon adds it.
  'circle-check': ['m16 9-5.5 5.5L8 12'],
  'triangle-alert': [
    'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3',
    'M12 9v4',
    'M12 17h.01',
  ],
  'octagon-alert': [
    'M12 16h.01',
    'M12 8v4',
    'M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z',
  ],
  'octagon-x': [
    'm15 9-6 6',
    'M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z',
    'm9 9 6 6',
  ],
};

export function BandIcon({ icon, size = 14 }: { icon: BandToken['icon']; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icon === 'circle-check' ? <circle cx="12" cy="12" r="10" /> : null}
      {ICON_PATHS[icon].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/**
 * A band as keel-frontend's landing page shows it: icon, colour and word together, from
 * the encoding in `tokens.ts`. The word is the API's own value, so the same reading reads
 * the same here, in the dashboard and in keel-mcp output.
 */
export function BandWord({ band }: { band: Band }) {
  const token = BAND_TOKENS[band];
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        px: '8px',
        py: '2px',
        borderRadius: '999px',
        fontWeight: 600,
        lineHeight: 1.4,
        color: token.ink,
        bgcolor: token.surface,
        verticalAlign: 'baseline',
      }}
    >
      <BandIcon icon={token.icon} />
      {band}
    </Box>
  );
}
