import type { DepthFigure } from '@/lib/keel/landing/story';
import type { HeroHistory } from '@/lib/keel/landing/history';
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
  history: HeroHistory;
  assetCount: number;
};

export default function LandingPage({ hero, depth, history, assetCount }: LandingPageProps) {
  return (
    <>
      <HeroHeader reading={hero} />
      <HowItWorks depth={depth} />
      <BentoSection history={history} hero={hero} />
      <StatsGrid assetCount={assetCount} />
      <FaqAccordion />
      <CtaImage />
    </>
  );
}
