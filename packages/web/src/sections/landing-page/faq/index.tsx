'use client';

import * as React from 'react';
import { useState } from 'react';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import { COPY } from '../copy';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type Question = { title: string; answer: string };

export interface FaqAccordionProps extends React.ComponentPropsWithoutRef<'section'> {
  heading?: string;
  subhead?: string;
  questions?: Question[];
}

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const DEFAULT_QUESTIONS: Question[] = COPY.faq.questions.map((q) => ({ ...q }));

/** Plus and close marks, drawn inline so the page calls no icon service. */
const ToggleIcon = ({ open }: { open: boolean }) => (
  <svg
    aria-hidden="true"
    width={15}
    height={15}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
  >
    {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M12 5v14M5 12h14" />}
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Styled overrides                                                    */
/* ------------------------------------------------------------------ */

const Accordion = styled(MuiAccordion)({
  background: 'var(--surface)',
  boxShadow: 'none !important',
  border: '1px solid var(--border)',
  borderRadius: '16px !important',
  overflow: 'hidden',
  '&::before': { display: 'none' },
  '&.Mui-expanded': { margin: 0, background: 'var(--surface)' },
});

const AccordionSummary = styled(MuiAccordionSummary)({
  padding: '0 20px',
  minHeight: 'unset',
  '&.Mui-expanded': { minHeight: 'unset' },
  '& .MuiAccordionSummary-content': {
    margin: '20px 0',
    '&.Mui-expanded': { margin: '20px 0' },
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    transform: 'none !important',
  },
});

const AccordionDetails = styled(MuiAccordionDetails)({
  padding: '0 20px 22px',
});

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  heading = COPY.faq.title,
  subhead,
  questions,
  ...sectionProps
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const list = questions?.length ? questions : DEFAULT_QUESTIONS;

  return (
    <Box
      component="section"
      aria-labelledby="faq-heading"
      sx={{ pt: { xs: '40px', md: '56px' }, pb: { xs: '80px', md: '110px' } }}
      {...sectionProps}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        {/* Header */}
        <Box sx={{ mb: '56px' }}>
          <Box
            component="h2"
            id="faq-heading"
            sx={{
              m: 0,
              fontSize: 'clamp(34px, 4.4vw, 56px)',
              fontWeight: 500,
              letterSpacing: '-0.03em',
              lineHeight: 1.04,
              color: 'var(--ink)',
              maxWidth: '22ch',
            }}
          >
            {heading}
          </Box>

          {subhead && (
            <Box
              component="p"
              sx={{
                m: 0,
                mt: '14px',
                fontSize: '15px',
                color: 'var(--muted)',
                lineHeight: 1.6,
                maxWidth: '60ch',
              }}
            >
              {subhead}
            </Box>
          )}
        </Box>

        {/* FAQ 2-column layout: each column is independent so expanding doesn't affect the other */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: '10px',
            alignItems: 'start',
          }}
        >
          {[list.slice(0, Math.ceil(list.length / 2)), list.slice(Math.ceil(list.length / 2))].map(
            (col, colIdx) => (
              <Box key={colIdx} sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.map((q, rowIdx) => {
                  const i = colIdx === 0 ? rowIdx : Math.ceil(list.length / 2) + rowIdx;
                  return (
                    <Accordion
                      key={i}
                      disableGutters
                      elevation={0}
                      square={false}
                      expanded={openIndex === i}
                      onChange={(_, isOpen) => setOpenIndex(isOpen ? i : null)}
                    >
                      <AccordionSummary
                        expandIcon={
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              bgcolor: 'var(--accent)',
                              color: 'var(--on-brand)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <ToggleIcon open={openIndex === i} />
                          </Box>
                        }
                      >
                        <Box
                          sx={{
                            fontSize: '15px',
                            fontWeight: 500,
                            letterSpacing: '-0.01em',
                            color: 'var(--ink)',
                            lineHeight: 1.4,
                            pr: 1,
                          }}
                        >
                          {q.title}
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Box
                          sx={{
                            fontSize: '14px',
                            lineHeight: 1.65,
                            color: 'var(--muted)',
                            whiteSpace: 'pre-line',
                          }}
                        >
                          {q.answer}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Box>
            )
          )}
        </Box>
      </Box>
    </Box>
  );
};

FaqAccordion.displayName = 'FaqAccordion';
