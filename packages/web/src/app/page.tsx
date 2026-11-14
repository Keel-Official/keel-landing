import LandingPage from '@/sections/landing-page';
import { depthStep } from '@/lib/keel/landing/story';
import { readHero } from '@/lib/keel/landing/readings';

// Every Keel read happens here, on the server; the sections only present what they get.
export default async function Page() {
  const hero = await readHero();
  return <LandingPage hero={hero} depth={depthStep()} />;
}
