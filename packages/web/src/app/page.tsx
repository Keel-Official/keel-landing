import LandingPage from '@/sections/landing-page';
import { depthStep } from '@/lib/keel/landing/story';
import { readHeroHistory } from '@/lib/keel/landing/history';
import { readHero, readAssetCount } from '@/lib/keel/landing/readings';

// Every Keel read happens here, on the server; the sections only present what they get.
export default async function Page() {
  const [hero, history, assetCount] = await Promise.all([
    readHero(),
    readHeroHistory(),
    readAssetCount(),
  ]);
  return <LandingPage hero={hero} depth={depthStep()} history={history} assetCount={assetCount} />;
}
