import 'server-only';

import type { AssetRisk, HistoryResponse, AssetListResponse } from './types';

/**
 * A small typed client for the three Keel API reads the landing page makes.
 *
 * Every read runs on the server, so the browser never contacts the API. The base URL
 * comes from `NEXT_PUBLIC_KEEL_API_BASE`, for example `http://localhost:3000/v1`.
 * Nothing is cached: the page shows how fresh each figure is, and a cached page would
 * misstate that.
 *
 * A failed read is returned as data, never thrown. The callers in `landing/` then use
 * the saved responses in `fixtures/` and say so.
 */

/** Both headers are stamped on every response; see keel-frontend `lib/keel/api/client.ts`. */
export const METHODOLOGY_VERSION_HEADER = 'x-keel-methodology-version';
export const STALENESS_SECONDS_HEADER = 'x-keel-staleness-seconds';

/** A dead or unreachable API must not hold the page. */
const TIMEOUT_MS = 5000;

export interface KeelProvenance {
  readonly methodologyVersion: string | null;
  readonly stalenessSeconds: string | null;
}

export interface Fetched<T> {
  readonly data: T | null;
  /** HTTP status, or 0 when the API was not reached or is not configured. */
  readonly status: number;
  readonly provenance: KeelProvenance;
}

const NO_PROVENANCE: KeelProvenance = { methodologyVersion: null, stalenessSeconds: null };

export function keelApiBase(): string | null {
  const base = process.env.NEXT_PUBLIC_KEEL_API_BASE;
  return base ? base.replace(/\/+$/, '') : null;
}

async function get<T>(
  path: string,
  query: Record<string, string | number> = {}
): Promise<Fetched<T>> {
  const base = keelApiBase();
  if (!base) return { data: null, status: 0, provenance: NO_PROVENANCE };

  const search = new URLSearchParams(
    Object.entries(query).map(([key, value]) => [key, String(value)])
  ).toString();

  try {
    const response = await fetch(`${base}${path}${search ? `?${search}` : ''}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const provenance: KeelProvenance = {
      methodologyVersion: response.headers.get(METHODOLOGY_VERSION_HEADER),
      stalenessSeconds: response.headers.get(STALENESS_SECONDS_HEADER),
    };
    if (!response.ok) return { data: null, status: response.status, provenance };
    return { data: (await response.json()) as T, status: response.status, provenance };
  } catch {
    return { data: null, status: 0, provenance: NO_PROVENANCE };
  }
}

/** `GET /assets`. The landing page reads `total` from it. */
export function fetchAssets(): Promise<Fetched<AssetListResponse>> {
  return get<AssetListResponse>('/assets', { limit: 200 });
}

/**
 * `GET /asset/{assetId}/depth`. `priceSource: "none"` comes back as HTTP 200 with band
 * CRITICAL: it is a finding, returned as data, never an error.
 */
export function fetchDepth(assetId: string): Promise<Fetched<AssetRisk>> {
  return get<AssetRisk>(`/asset/${encodeURIComponent(assetId)}/depth`);
}

/** `GET /asset/{assetId}/history` for a ledger range at the given resolution. */
export function fetchHistory(
  assetId: string,
  range: { from: number; to: number; resolution: 'hour' | 'day' }
): Promise<Fetched<HistoryResponse>> {
  return get<HistoryResponse>(`/asset/${encodeURIComponent(assetId)}/history`, range);
}
