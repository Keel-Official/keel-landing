import type { LandingReading } from '@/lib/keel/landing/readings';

import { CtaImage } from './cta';
import { FaqAccordion } from './faq';
import { HeroHeader } from './hero-header';
import { BentoSection } from './bento-section';
import { StatsGrid } from './stats-grid/stats-grid';
import RoadmapSection from '../../components/RoadmapSection';

export type LandingPageProps = {
  hero: LandingReading;
};

export default function LandingPage({ hero }: LandingPageProps) {
  return (
    <>
      <HeroHeader reading={hero} />
      <RoadmapSection />
      <BentoSection />
      <StatsGrid />
      <FaqAccordion />
      <CtaImage />
    </>
  );
}
