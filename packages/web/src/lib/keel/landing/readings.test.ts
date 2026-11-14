import { readHero, readAssetCount } from './readings';
import { ustryDepth, liveAssetList } from '../fixtures';

// Next's server build provides React's `cache`; plain React 18 in jest does not.
jest.mock('react', () => ({ ...jest.requireActual('react'), cache: (fn: unknown) => fn }));

const BASE = 'http://keel.test/v1';

function respond(body: unknown, headers: Record<string, string> = {}, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json', ...headers },
    })
  );
}

describe('landing readings', () => {
  const realFetch = global.fetch;

  afterEach(() => {
    global.fetch = realFetch;
    delete process.env.NEXT_PUBLIC_KEEL_API_BASE;
  });

  it('uses the saved reading, and says so, when no API is configured', async () => {
    global.fetch = jest.fn();
    const hero = await readHero();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(hero.live).toBe(false);
    expect(hero.reading).toBe(ustryDepth);
    expect(hero.stalenessSeconds).toBeNull();
    expect(await readAssetCount()).toBe(liveAssetList.total);
  });

  it('uses the saved reading when the API does not answer', async () => {
    process.env.NEXT_PUBLIC_KEEL_API_BASE = BASE;
    global.fetch = jest.fn(() => Promise.reject(new Error('connection refused')));
    const hero = await readHero();
    expect(hero.live).toBe(false);
    expect(hero.reading).toBe(ustryDepth);
  });

  it('reads a live reading with the provenance the engine sent', async () => {
    process.env.NEXT_PUBLIC_KEEL_API_BASE = `${BASE}/`;
    const live = { ...ustryDepth, ledgerSeq: 65474271 };
    global.fetch = jest.fn(() =>
      respond(live, { 'X-Keel-Methodology-Version': '9.9.9', 'X-Keel-Staleness-Seconds': '42' })
    );
    const hero = await readHero();
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}/asset/${encodeURIComponent(ustryDepth.asset.code + ':' + ustryDepth.asset.issuer)}/depth`,
      expect.objectContaining({ cache: 'no-store' })
    );
    expect(hero.live).toBe(true);
    expect(hero.reading.ledgerSeq).toBe(65474271);
    expect(hero.methodologyVersion).toBe('9.9.9');
    expect(hero.stalenessSeconds).toBe(42);
  });

  it('keeps a priceSource "none" reading as data, not as a failure', async () => {
    process.env.NEXT_PUBLIC_KEEL_API_BASE = BASE;
    const noPrice = { ...ustryDepth, priceSource: 'none', band: 'CRITICAL' };
    global.fetch = jest.fn(() => respond(noPrice));
    const hero = await readHero();
    expect(hero.live).toBe(true);
    expect(hero.reading.priceSource).toBe('none');
    expect(hero.reading.band).toBe('CRITICAL');
  });

  it('reads the asset count from the engine total', async () => {
    process.env.NEXT_PUBLIC_KEEL_API_BASE = BASE;
    global.fetch = jest.fn(() => respond({ ...liveAssetList, total: 8 }));
    expect(await readAssetCount()).toBe(8);
  });
});
