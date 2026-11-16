'use client';

import Box from '@mui/material/Box';

import { COPY } from '../../copy';
import {
  C,
  u,
  grow,
  Label,
  Scene,
  BASE_Y,
  reveal,
  Baseline,
  useSvgId,
  FloatCard,
  DotCaption,
  CalloutLeader,
} from '../stage-kit';

import type { SceneProps } from '../stage-kit';

// ----------------------------------------------------------------------

const PRICE = [280, 150] as const;
/** Right of the price, clear of the sources card on the left. */
const CAPTION = [400, 114] as const;

/** Offer heights, nearest the price first. A shape, not a measurement. */
export const OFFER_HEIGHTS = [22, 36, 52, 68, 84, 98, 112, 124] as const;
export const OFFER = { width: 14, pitch: 20, gap: 14 } as const;

export const buyX = (i: number) => PRICE[0] - OFFER.gap - OFFER.width - i * OFFER.pitch;
export const sellX = (i: number) => PRICE[0] + OFFER.gap + i * OFFER.pitch;

/** The two offer fills: a story hue fading to a pale end of the same hue. */
export function OfferGradients({ prefix }: { prefix: string }) {
  return (
    <>
      <linearGradient id={`${prefix}-buy`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={{ stopColor: 'var(--story-depth)' }} />
        <stop offset="1" style={{ stopColor: 'var(--story-depth)', stopOpacity: 0.35 }} />
      </linearGradient>
      <linearGradient id={`${prefix}-sell`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={{ stopColor: 'var(--story-sell)' }} />
        <stop offset="1" style={{ stopColor: 'var(--story-sell)', stopOpacity: 0.35 }} />
      </linearGradient>
    </>
  );
}

function SourceRow({ glyph, children }: { glyph: 'book' | 'pool'; children: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: u(8) }}>
      <Box
        component="span"
        aria-hidden="true"
        sx={{
          width: u(18),
          height: u(18),
          borderRadius: u(5),
          bgcolor: 'rgba(10,10,15,0.05)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {glyph === 'book' ? (
          <Box sx={{ display: 'grid', gap: u(1.5) }}>
            {[8, 6, 9].map((w, i) => (
              <Box key={i} sx={{ width: u(w), height: u(1.5), bgcolor: C.ink2, borderRadius: 1 }} />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              width: u(9),
              height: u(9),
              borderRadius: '50%',
              border: `${u(1.5)} solid ${C.ink2}`,
            }}
          />
        )}
      </Box>
      {children}
    </Box>
  );
}

/**
 * Step 2, "What matters is what stands behind it.": open offers rise on both sides of
 * the price, taller further from it, and a card names where they come from.
 */
export function SceneOffers({ beat, instant }: SceneProps) {
  const copy = COPY.story;
  const svgId = useSvgId();
  const caption = beat >= 3;

  return (
    <Scene
      label={copy.steps[1].dot}
      svg={
        <>
          <defs>
            <OfferGradients prefix={svgId} />
          </defs>

          <Baseline />

          {OFFER_HEIGHTS.map((h, i) => (
            <g key={h}>
              <rect
                x={buyX(i)}
                y={BASE_Y - h}
                width={OFFER.width}
                height={h}
                rx={4}
                fill={`url(#${svgId}-buy)`}
                style={grow(beat >= 1, instant, i * 45)}
              />
              <rect
                x={sellX(i)}
                y={BASE_Y - h}
                width={OFFER.width}
                height={h}
                rx={4}
                fill={`url(#${svgId}-sell)`}
                style={grow(beat >= 1, instant, i * 45)}
              />
            </g>
          ))}

          <line
            x1={PRICE[0]}
            y1={PRICE[1] + 9}
            x2={PRICE[0]}
            y2={BASE_Y}
            stroke={C.price}
            strokeOpacity={0.55}
            strokeWidth={1.5}
          />
          <circle cx={PRICE[0]} cy={PRICE[1]} r={9} fill={C.price} />

          <g style={reveal(beat >= 1, instant, 300)}>
            <Label x={buyX(3.5) + OFFER.width / 2}>{copy.stage.offersToBuy}</Label>
            <Label x={PRICE[0]} ink>
              {copy.stage.price}
            </Label>
            <Label x={sellX(3.5) + OFFER.width / 2}>{copy.stage.offersToSell}</Label>
          </g>

          <CalloutLeader
            from={[PRICE[0] + 7, PRICE[1] - 9]}
            to={[CAPTION[0] - 20, CAPTION[1] + 2]}
            show={caption}
            instant={instant}
          />
        </>
      }
    >
      <FloatCard x={36} y={36} anchor="belowStart" show={beat >= 2} instant={instant}>
        <Box sx={{ display: 'grid', gap: u(7), fontWeight: 500 }}>
          <SourceRow glyph="book">{copy.stage.orderBook}</SourceRow>
          <SourceRow glyph="pool">{copy.stage.liquidityPools}</SourceRow>
        </Box>
      </FloatCard>

      <DotCaption x={CAPTION[0]} y={CAPTION[1]} anchor="above" show={caption} instant={instant}>
        {copy.steps[1].dot}
      </DotCaption>
    </Scene>
  );
}
