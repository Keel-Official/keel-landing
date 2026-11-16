import { notFound } from 'next/navigation';
import { glanceReadings } from '@/lib/keel/landing/glance';
import { recordedReading } from '@/lib/keel/landing/readings';
import { ustryDepth, ustryHistory } from '@/lib/keel/fixtures';
import { GlanceSection } from '@/sections/landing-page/glance';

/**
 * Development only: section 3 with an edge-case fixture, for screenshots and review.
 * The history is the saved USTRY response (it has a gap); the current reading is the
 * saved USTRY reading altered to the cases the section must handle: partial confidence
 * and no price at all, which the engine reports as CRITICAL. Test data, never shown in
 * production.
 */
export default function GlanceEdgeCases() {
  if (process.env.NODE_ENV === 'production') notFound();

  const lastAt = ustryHistory.points.at(-1)?.ledgerClosedAt ?? ustryDepth.ledgerClosedAt;
  const edge = {
    ...ustryDepth,
    // TEST DATA: a reading after the saved history, with no price.
    ledgerSeq: ustryHistory.to + 17_280,
    ledgerClosedAt: new Date(Date.parse(lastAt) + 86_400_000).toISOString(),
    priceSource: 'none' as const,
    midPrice: null,
    band: 'CRITICAL' as const,
    bandConfidence: 'partial' as const,
  };
  const reading = recordedReading(edge);

  return (
    <GlanceSection
      glance={{
        reading,
        history: glanceReadings(ustryHistory, edge, edge.methodologyVersion, false),
      }}
    />
  );
}
