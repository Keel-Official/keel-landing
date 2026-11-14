import LandingPage from '@/sections/landing-page';
import { depthStep } from '@/lib/keel/landing/story';
import { readHero } from '@/lib/keel/landing/readings';
import { readHeroHistory } from '@/lib/keel/landing/history';

// Every Keel read happens here, on the server; the sections only present what they get.
export default async function Page() {
  const [hero, history] = await Promise.all([readHero(), readHeroHistory()]);
  return <LandingPage hero={hero} depth={depthStep()} history={history} />;
}
