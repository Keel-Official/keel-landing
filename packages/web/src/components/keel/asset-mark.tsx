import { assetIcon } from '@/lib/keel/assets/icons';

import Box from '@mui/material/Box';

/**
 * The mark beside an asset code (DEC-007). Decorative: the code and the issuer domain
 * or shortened issuer address are always written next to it, so it never stands alone.
 *
 * The mark is a monogram of the first two characters of the code, case kept, in one
 * neutral colour. Never a "?" (that would read as unknown risk) and never a band or
 * hashed colour (colour carries risk meaning).
 *
 * Native XLM shows the official Stellar mark, and the few assets listed in
 * `lib/keel/assets/icons.ts` show the icon stored for them there (decision 007,
 * amended). The icon is matched on code and issuer, never on code alone.
 *
 * Ported from keel-frontend `components/keel/asset-mark.tsx`; only the Tailwind classes
 * became MUI `sx`.
 */

const SIZES = {
  sm: { size: 24, fontSize: 12 },
  md: { size: 32, fontSize: 14 },
} as const;

export type AssetMarkSize = keyof typeof SIZES;

export interface AssetMarkProps {
  code: string;
  /** `null` for the native asset. */
  issuer: string | null;
  size?: AssetMarkSize;
  className?: string;
}

/** Native XLM is the asset with no issuer. Any issuer can create a code called XLM. */
export function isNativeXlm(code: string, issuer: string | null) {
  return issuer === null && code === 'XLM';
}

export function AssetMark({ code, issuer, size = 'md', className }: AssetMarkProps) {
  const native = isNativeXlm(code, issuer);
  const icon = assetIcon(code, issuer);
  const box = SIZES[size];

  if (icon)
    return (
      <Box
        component="span"
        aria-hidden="true"
        data-native={native ? 'true' : undefined}
        className={className}
        sx={{
          display: 'inline-flex',
          flexShrink: 0,
          overflow: 'hidden',
          borderRadius: '6px',
          width: box.size,
          height: box.size,
        }}
      >
        {/* Decorative: the code is written beside it. A plain img, because these are
            small static files served as they are. */}
        <img src={icon.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Box>
    );

  return (
    <Box
      component="span"
      aria-hidden="true"
      data-native={native ? 'true' : undefined}
      className={className}
      sx={{
        display: 'inline-flex',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        bgcolor: 'var(--surface-2)',
        color: 'var(--muted)',
        lineHeight: 1,
        fontWeight: 600,
        width: box.size,
        height: box.size,
        fontSize: box.fontSize,
      }}
    >
      {code.slice(0, 2)}
    </Box>
  );
}
