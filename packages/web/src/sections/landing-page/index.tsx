import type { DepthPanel } from '@/lib/keel/landing/story';
import type { HeroHistory } from '@/lib/keel/landing/history';
import type { LandingReading } from '@/lib/keel/landing/readings';

import { CtaImage } from './cta';
import { FaqAccordion } from './faq';
import { HeroHeader } from './hero-header';
import { PriceStory } from './price-story';
import { BentoSection } from './bento-section';
import { StatsGrid } from './stats-grid/stats-grid';

export type LandingPageProps = {
  hero: LandingReading;
  depth: readonly [DepthPanel, DepthPanel];
  history: HeroHistory;
  assetCount: number;
};

export default function LandingPage({ hero, depth, history, assetCount }: LandingPageProps) {
  return (
    <>
      <HeroHeader reading={hero} />
      <PriceStory depth={depth} />
      <BentoSection history={history} hero={hero} />
      <StatsGrid assetCount={assetCount} />
      <FaqAccordion />
      <CtaImage />
    </>
  );
}
