import type { Metadata } from 'next';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', px: 3, py: { xs: 10, md: 15 }, textAlign: 'center' }}>
      <Typography component="h1" sx={{ fontSize: 32, fontWeight: 500, mb: 2 }}>
        Page not found
      </Typography>
      <Box component="a" href="/" sx={{ color: 'text.primary', fontSize: 15 }}>
        Go to the home page
      </Box>
    </Box>
  );
}
