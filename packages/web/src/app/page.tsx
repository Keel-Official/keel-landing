import LandingPage from '@/sections/landing-page';
import { depthPanels } from '@/lib/keel/landing/story';
import { readGlance } from '@/lib/keel/landing/glance';
import { readHero, readAssetCount } from '@/lib/keel/landing/readings';

// Every Keel read happens here, on the server; the sections only present what they get.
export default async function Page() {
  const [hero, glance, assetCount] = await Promise.all([
    readHero(),
    readGlance(),
    readAssetCount(),
  ]);
  return <LandingPage hero={hero} depth={depthPanels()} glance={glance} assetCount={assetCount} />;
}
