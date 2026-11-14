import xlmDepthJson from './live-xlm-depth.json';
import ustryDepthJson from './live-ustry-depth.json';
import liveAssetListJson from './live-asset-list.json';
import ustryHistoryJson from './live-ustry-history.json';

import type { AssetRisk, HistoryResponse, AssetListResponse } from '../api/types';

/**
 * Saved real responses from the Keel API, copied unchanged from keel-frontend
 * `public/evidence`. They stand in when the API does not answer. Do not edit a value.
 */
export const ustryDepth = ustryDepthJson as unknown as AssetRisk;
export const xlmDepth = xlmDepthJson as unknown as AssetRisk;
export const liveAssetList = liveAssetListJson as unknown as AssetListResponse;
export const ustryHistory = ustryHistoryJson as unknown as HistoryResponse;
