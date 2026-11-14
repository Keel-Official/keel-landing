'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export type FooterProps = { sx?: object };

export function FooterSection({ sx }: FooterProps = {}) {
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
        {/* Brand column */}
        <Typography sx={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: '#fff' }}>
          Keel
        </Typography>
      </Box>
    </Box>
  );
}
