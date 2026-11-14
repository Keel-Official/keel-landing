import { CtaImage } from './cta';
import { FaqAccordion } from './faq';
import { HeroHeader } from './hero-header';
import { BentoSection } from './bento-section';
import { StatsGrid } from './stats-grid/stats-grid';
import RoadmapSection from '../../components/RoadmapSection';

export default function LandingPage() {
  return (
    <>
      <HeroHeader />
      <RoadmapSection />
      <BentoSection />
      <StatsGrid />
      <FaqAccordion />
      <CtaImage />
    </>
  );
}
