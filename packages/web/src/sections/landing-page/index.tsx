import type { DepthFigure } from '@/lib/keel/landing/story';
import type { LandingReading } from '@/lib/keel/landing/readings';

import { CtaImage } from './cta';
import { FaqAccordion } from './faq';
import { HeroHeader } from './hero-header';
import { HowItWorks } from './how-it-works';
import { BentoSection } from './bento-section';
import { StatsGrid } from './stats-grid/stats-grid';

export type LandingPageProps = {
  hero: LandingReading;
  depth: { deep: DepthFigure; thin: DepthFigure };
};

export default function LandingPage({ hero, depth }: LandingPageProps) {
  return (
    <>
      <HeroHeader reading={hero} />
      <HowItWorks depth={depth} />
      <BentoSection />
      <StatsGrid />
      <FaqAccordion />
      <CtaImage />
    </>
  );
}
