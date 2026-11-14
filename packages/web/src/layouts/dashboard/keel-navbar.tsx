'use client';

import { Box } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function KeelNavbar() {
  const theme = useTheme();

  return (
    <Box
      component="section"
      id="keel-navbar"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: (_theme) => _theme.zIndex.appBar,
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(10,10,15,0.04)',
        background:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.92)
            : 'rgba(250,250,251,0.72)',
        backdropFilter: 'blur(14px) saturate(140%)',
        WebkitBackdropFilter: 'blur(14px) saturate(140%)',
        minHeight: { xs: 64, lg: 72 },
        px: { xs: 2, lg: 4 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1400,
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Text wordmark until Al supplies a logo. */}
        <Box
          component="a"
          href="/"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '999px',
            px: '10px',
            py: '6px',
            fontSize: '20px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'text.primary',
            textDecoration: 'none',
            transition: 'background 0.15s',
            '&:hover': { background: 'rgba(10,10,15,0.04)' },
          }}
        >
          Keel
        </Box>
      </Box>
    </Box>
  );
}
