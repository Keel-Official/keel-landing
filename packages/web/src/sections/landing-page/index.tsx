import type { Glance } from '@/lib/keel/landing/glance';
import type { DepthPanel } from '@/lib/keel/landing/story';
import type { LandingReading } from '@/lib/keel/landing/readings';

import { CtaImage } from './cta';
import { FaqAccordion } from './faq';
import { GlanceSection } from './glance';
import { HeroHeader } from './hero-header';
import { PriceStory } from './price-story';
import { CheckedRows } from './checked-rows';
import { AssetScatter } from './asset-scatter';
import { StatsGrid } from './stats-grid/stats-grid';
import { GradientBackdrop } from './gradient-backdrop';

export type LandingPageProps = {
  hero: LandingReading;
  depth: readonly [DepthPanel, DepthPanel];
  glance: Glance;
  assetCount: number;
};

export default function LandingPage({ hero, depth, glance, assetCount }: LandingPageProps) {
  return (
    <>
      {/* Behind every light section; the ink panels cover it. */}
      <GradientBackdrop />
      <AssetScatter seed="hero">
        <HeroHeader reading={hero} />
      </AssetScatter>
      <AssetScatter seed="price-story">
        <PriceStory depth={depth} />
      </AssetScatter>
      {/* Section 3 shows one real reading: no scattered logos around it. */}
      <GlanceSection glance={glance} />
      <AssetScatter seed="bento">
        <CheckedRows hero={hero} />
      </AssetScatter>
      <AssetScatter seed="ways-in">
        <StatsGrid assetCount={assetCount} />
      </AssetScatter>
      <AssetScatter seed="faq">
        <FaqAccordion />
      </AssetScatter>
      <AssetScatter seed="cta">
        <CtaImage />
      </AssetScatter>
    </>
  );
}
