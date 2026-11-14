'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

/* ------------------------------------------------------------------ */
/* BentoSection                                                        */
/* ------------------------------------------------------------------ */
export function BentoSection() {
  return (
    <Box component="section" sx={{ py: { xs: '80px', md: '110px' }, background: '#FAFAFB' }}>
      <Container maxWidth={false} sx={{ maxWidth: '1240px', px: { xs: 2, sm: 3 } }}>
        {/* Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(6, 1fr)' },
            gridAutoRows: { xs: 'auto', md: 'minmax(290px, auto)' },
            gap: { xs: '10px', md: '14px' },
          }}
        />
      </Container>
    </Box>
  );
}
