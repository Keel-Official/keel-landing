'use client';

import Box from '@mui/material/Box';

import { COPY } from '../../copy';
import { buyX, sellX, OFFER, OFFER_HEIGHTS, OfferGradients } from './scene-2-offers';
import {
  C,
  u,
  tr,
  grow,
  Label,
  Scene,
  BASE_Y,
  SPRING,
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
/** Above and right of the price, clear of the lending app card. */
const CAPTION = [400, 114] as const;
const PUSH = 96;
const STEM = BASE_Y - (PRICE[1] + 9);
/** The stem's stretch while the price is pushed up, so it still reaches the dot. */
const STEM_PUSHED = (STEM + PUSH) / STEM;

/** The few offers to sell that pushing the price up eats through. */
const THIN_SELL = [10, 14, 18] as const;

const COLLATERAL = { x: 384, width: 40, height: 46 } as const;
const INFLATED_TOP = 120;
const LOAN = { x: 470, width: 40, top: 180 } as const;

type Mark = 'up' | 'down' | 'done' | null;

function StatusRow({ label, mark, instant }: { label: string; mark: Mark; instant: boolean }) {
  const glyph = mark === 'up' ? '↑' : mark === 'down' ? '↓' : mark === 'done' ? '✓' : '';
  const tint = mark === 'down' ? C.ink2 : mark ? 'var(--on-brand)' : 'transparent';
  const bg =
    mark === 'up' ? 'var(--story-pushed)' : mark === 'done' ? 'var(--story-price)' : 'transparent';

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: u(18) }}
      style={{ opacity: mark ? 1 : 0.4, transition: tr(instant, 'opacity 300ms ease') }}
    >
      <span>{label}</span>
      <Box
        component="span"
        aria-hidden="true"
        sx={{
          width: u(16),
          height: u(16),
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          fontSize: u(10),
          fontWeight: 700,
          border: `1px solid ${mark === 'down' ? C.line : 'transparent'}`,
        }}
        style={{
          backgroundColor: mark === 'down' ? 'var(--surface)' : bg,
          color: tint,
          transform: mark ? 'scale(1)' : 'scale(0.6)',
          transition: tr(instant, `transform 500ms ${SPRING}, background-color 300ms ease`),
        }}
      >
        {glyph}
      </Box>
    </Box>
  );
}

/**
 * Step 4, "Lending apps trust the price.": the price is pushed up through thin offers
 * to sell, the lending app's view of the collateral inflates, a loan goes out against
 * it, and the price falls back. The loan stays out. No numbers.
 */
export function SceneLending({ beat, instant }: SceneProps) {
  const copy = COPY.story;
  const svgId = useSvgId();
  const pushed = beat >= 1 && beat < 4;
  const inflated = beat >= 2 && beat < 4;
  const loaned = beat >= 3;
  const caption = beat >= 5;

  const priceMark: Mark = beat >= 4 ? 'down' : beat >= 1 ? 'up' : null;
  const collateralMark: Mark = beat >= 4 ? 'down' : beat >= 2 ? 'up' : null;
  const loanMark: Mark = loaned ? 'done' : null;

  return (
    <Scene
      label={copy.steps[3].dot}
      svg={
        <>
          <defs>
            <OfferGradients prefix={svgId} />
            <linearGradient id={`${svgId}-coll`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: 'var(--story-price)' }} />
              <stop offset="1" style={{ stopColor: 'var(--story-price)', stopOpacity: 0.4 }} />
            </linearGradient>
          </defs>

          <Baseline />

          {OFFER_HEIGHTS.map((h, i) => (
            <rect
              key={h}
              x={buyX(i)}
              y={BASE_Y - h}
              width={OFFER.width}
              height={h}
              rx={4}
              fill={`url(#${svgId}-buy)`}
            />
          ))}
          {THIN_SELL.map((h, i) => (
            <rect
              key={h}
              x={sellX(i)}
              y={BASE_Y - h}
              width={OFFER.width}
              height={h}
              rx={4}
              fill={`url(#${svgId}-sell)`}
              style={{
                opacity: beat >= 1 ? 0 : 1,
                transition: tr(instant, `opacity 400ms ease ${i * 90}ms`),
              }}
            />
          ))}

          {/* The collateral as the lending app sees it: inflated while the price is up. */}
          <rect
            x={COLLATERAL.x}
            y={INFLATED_TOP}
            width={COLLATERAL.width}
            height={BASE_Y - INFLATED_TOP}
            rx={4}
            fill="var(--story-pushed)"
            fillOpacity={0.12}
            stroke="var(--story-pushed)"
            strokeWidth={1.25}
            strokeDasharray="3 3"
            style={{
              ...grow(inflated, instant),
              opacity: inflated ? 1 : 0,
              transition: tr(instant, `transform 1000ms ${SPRING}, opacity 400ms ease`),
            }}
          />
          <rect
            x={COLLATERAL.x}
            y={BASE_Y - COLLATERAL.height}
            width={COLLATERAL.width}
            height={COLLATERAL.height}
            rx={4}
            fill={`url(#${svgId}-coll)`}
          />
          <Label x={COLLATERAL.x + COLLATERAL.width / 2}>{copy.stage.collateralValue}</Label>

          {/* The loan, sized off the inflated value. It does not shrink back. */}
          <rect
            x={LOAN.x}
            y={LOAN.top}
            width={LOAN.width}
            height={BASE_Y - LOAN.top}
            rx={4}
            fill="var(--story-pushed)"
            fillOpacity={0.1}
            stroke="var(--story-pushed)"
            strokeWidth={1.5}
            style={grow(loaned, instant)}
          />
          <Label x={LOAN.x + LOAN.width / 2} style={reveal(loaned, instant)}>
            {copy.stage.loan}
          </Label>

          {/* The price: pushed up, then back. */}
          <g
            style={{
              transform: `translateY(${pushed ? -PUSH : 0}px)`,
              transition: tr(instant, `transform 1100ms ${SPRING}`),
            }}
          >
            {pushed && !instant ? (
              <circle
                cx={PRICE[0]}
                cy={PRICE[1]}
                r={9}
                fill="none"
                stroke="var(--story-pushed)"
                strokeWidth={1.5}
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                  animation: 'psPing 1s ease-out 1 both',
                }}
              />
            ) : null}
            <circle
              cx={PRICE[0]}
              cy={PRICE[1]}
              r={9}
              style={{
                fill: pushed ? 'var(--story-pushed)' : 'var(--story-price)',
                transition: tr(instant, 'fill 300ms ease'),
              }}
            />
          </g>
          <line
            x1={PRICE[0]}
            y1={PRICE[1] + 9}
            x2={PRICE[0]}
            y2={BASE_Y}
            strokeWidth={1.5}
            strokeOpacity={0.55}
            style={{
              stroke: pushed ? 'var(--story-pushed)' : 'var(--story-price)',
              transformBox: 'fill-box',
              transformOrigin: '50% 100%',
              transform: `scaleY(${pushed ? STEM_PUSHED : 1})`,
              transition: tr(instant, `transform 1100ms ${SPRING}, stroke 300ms ease`),
            }}
          />
          <Label x={PRICE[0]} ink>
            {copy.stage.price}
          </Label>

          <CalloutLeader
            from={[PRICE[0] + 7, PRICE[1] - 9]}
            to={[CAPTION[0] - 20, CAPTION[1] + 2]}
            show={caption}
            instant={instant}
          />
        </>
      }
    >
      <FloatCard x={36} y={36} anchor="belowStart" show={beat >= 1} instant={instant}>
        <Box sx={{ color: C.muted, fontSize: u(10.5), mb: u(6) }}>{copy.stage.lendingApp}</Box>
        <Box sx={{ display: 'grid', gap: u(6), fontWeight: 500, minWidth: u(150) }}>
          <StatusRow label={copy.stage.price} mark={priceMark} instant={instant} />
          <StatusRow label={copy.stage.collateralValue} mark={collateralMark} instant={instant} />
          <StatusRow label={copy.stage.loan} mark={loanMark} instant={instant} />
        </Box>
      </FloatCard>

      <DotCaption x={CAPTION[0]} y={CAPTION[1]} anchor="above" show={caption} instant={instant}>
        {copy.steps[3].dot}
      </DotCaption>
    </Scene>
  );
}
