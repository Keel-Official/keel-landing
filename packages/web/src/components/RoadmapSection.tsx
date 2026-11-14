'use client';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

export const StepCard = styled('article')({
  backgroundColor: '#fff',
  border: '1px solid rgba(10,10,15,0.08)',
  borderRadius: 22,
  padding: 28,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'border-color 200ms, background 200ms',
  '&:hover': {
    borderColor: 'rgba(10,10,15,0.12)',
    background: '#fdfdfd',
  },
});

// ----------------------------------------------------------------------

export default function RoadmapSection() {
  return (
    <Box
      component="section"
      sx={{
        bgcolor: '#FAFAFB',
        pt: { xs: '80px', md: '110px' },
        pb: { xs: '40px', md: '56px' },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        {/* Phase grid */}
        <Box
          sx={{
            mt: '56px',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: '14px',
            alignItems: 'stretch',
          }}
         />
      </Box>
    </Box>
  );
}
