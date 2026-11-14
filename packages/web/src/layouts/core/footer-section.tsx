'use client';

import { COPY } from '@/sections/landing-page/copy';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export type FooterProps = {
  sx?: object;
  /** "Ledger N. Methodology V. Updated T ago." from the hero's reading. */
  provenance?: string;
};

export function FooterSection({ sx, provenance }: FooterProps = {}) {
  return (
    <Box
      component="footer"
      sx={[
        {
          bgcolor: '#0c0c0e',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background:
              'linear-gradient(90deg, transparent 0%, #00aff7 25%, #6E4BFF 55%, #f8279c 80%, transparent 100%)',
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: '24px',
          pt: '80px',
          pb: '48px',
        }}
      >
        {/* Main grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
            columnGap: '80px',
            rowGap: '32px',
          }}
        >
          {/* Brand column */}
          <Box>
            <Typography
              sx={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: '#fff' }}
            >
              Keel
            </Typography>

            <Stack sx={{ mt: '14px', gap: '4px' }}>
              {COPY.closing.footerLines.map((line) => (
                <Typography key={line} sx={{ fontSize: 14, color: '#8a8a93', lineHeight: 1.6 }}>
                  {line}
                </Typography>
              ))}
            </Stack>
          </Box>

          {/* Links */}
          <Stack
            component="ul"
            aria-label="Footer links"
            sx={{ listStyle: 'none', m: 0, p: 0, gap: 0 }}
          >
            {COPY.footer.links.map(([label, href]) => (
              <Box component="li" key={label}>
                <Box
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'block',
                    fontSize: 14,
                    color: '#cfcfd6',
                    py: '5px',
                    textDecoration: 'none',
                    '&:hover': { color: '#fff' },
                  }}
                >
                  {label}
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Bottom bar: the provenance of the reading shown above */}
        {provenance ? (
          <Box
            sx={{
              mt: '64px',
              pt: '28px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                color: '#8a8a93',
                fontFamily: '"Geist Mono", ui-monospace, monospace',
              }}
            >
              {provenance}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
