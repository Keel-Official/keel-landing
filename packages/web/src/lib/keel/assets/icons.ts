import { assetId } from '../format/decimal';

/**
 * The asset icons stored in this repository (decision 007, amended 13 November 2026).
 *
 * Keyed by the full asset id, code and issuer, never by code alone: codes collide, and
 * an asset that copies a code must not borrow its icon. Every entry says where its
 * file came from, so a reader of this file can check it. Any asset not listed here
 * keeps its monogram until the backend serves verified issuer icons.
 */
export interface AssetIcon {
  /** Path under `public/`. */
  readonly src: string;
  /** Where the file came from, and whether it has been checked against the issuer. */
  readonly source: string;
}

/** Native XLM: the official Stellar mark (decision 007, rule 2). */
export const STELLAR_MARK: AssetIcon = {
  src: '/brand/stellar-mark.png',
  source: 'Stellar mark, supplied by Al on 13 November 2026.',
};

const ICONS: Readonly<Record<string, AssetIcon>> = {
  [assetId('USTRY', 'GCRYUGD5NVARGXT56XEZI5CIFCQETYHAPQQTHO2O3IQZTHDH4LATMYWC')]: {
    src: '/brand/assets/ustry-gcryugd5.png',
    source:
      "Supplied by Al on 13 November 2026. Not yet checked against the issuer's stellar.toml.",
  },
  [assetId('THE1', 'GBGRBCUB6L7LH4JQ6EPDP7REH2DDACMCUQI76M3P6DM52QWU2Z5LIEVW')]: {
    src: '/brand/assets/the1-gbgrbcub.jpeg',
    source:
      "Supplied by Al on 13 November 2026. Not yet checked against the issuer's stellar.toml.",
  },
  // Issuer icons (Al, 16 November 2026): the `image` of the CURRENCIES entry in the
  // issuer's own stellar.toml, kept only where that toml lists the same code and issuer
  // (SEP-1, both ways). RCW is left out: its toml image is a watermarked stock picture.
  [assetId('ACT', 'GAHHULDPDVGB5WS5PH7BCGLJ7ZHECDBIIMKB62UPVDUOCHNFL7HX3FS7')]: {
    src: '/brand/assets/act-gahhuldp.png',
    source:
      "From the issuer's stellar.toml at authentic-payment.com, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('AFR', 'GBX6YI45VU7WNAAKA3RBFDR3I3UKNFHTJPQ5F6KOOKSGYIAM4TRQN54W')]: {
    src: '/brand/assets/afr-gbx6yi45.png',
    source:
      "From the issuer's stellar.toml at afreum.com, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('AIXDOGEX', 'GDQ3MN2EOI46K5CM5I3IONKRMPC2KVEAI5ZIWZ4F4RUJC4IJNHPBJUJL')]: {
    src: '/brand/assets/aixdogex-gdq3mn2e.svg',
    source:
      "From the issuer's stellar.toml at aixdogex.sentineltyche.com, which lists this issuer; fetched 16 November 2026.",
  },
  [assetId('AMM', 'GARQ7O5JPBD2DDVEFFZ2LVWH77BYSC7K7RMGI7W5GLRVSWPHZBNGBDOQ')]: {
    src: '/brand/assets/amm-garq7o5j.png',
    source:
      "From the issuer's stellar.toml at kingtroll.stellarmint.io, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('AQUA', 'GBNZILSTVQZ4R7IKQDGHYGY2QXL5QOFJYQMXPKWRRM5PAV7Y4M67AQUA')]: {
    src: '/brand/assets/aqua-gbnzilst.png',
    source:
      "From the issuer's stellar.toml at aqua.network, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('AUDD', 'GDC7X2MXTYSAKUUGAIQ7J7RPEIM7GXSAIWFYWWH4GLNFECQVJJLB2EEU')]: {
    src: '/brand/assets/audd-gdc7x2mx.png',
    source:
      "From the issuer's stellar.toml at audd.digital, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('BEER', 'GBL2VH6MT5QGTNQ7P725U2U6HI4MXEAKDCX3NO7OHAM2B6JNZSXLSHNN')]: {
    src: '/brand/assets/beer-gbl2vh6m.png',
    source:
      "From the issuer's stellar.toml at beer.stellarmint.io, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('BTC', 'GDPJALI4AZKUU2W426U5WKMAT6CN3AJRPIIRYR2YM54TL2GDWO5O2MZM')]: {
    src: '/brand/assets/btc-gdpjali4.png',
    source:
      "From the issuer's stellar.toml at ultracapital.xyz, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('BTCLN', 'GDPKQ2TSNJOFSEE7XSUXPWRP27H6GFGLWD7JCHNEYYWQVGFA543EVBVT')]: {
    src: '/brand/assets/btcln-gdpkq2ts.png',
    source:
      "From the issuer's stellar.toml at kbtrading.org, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('DicInu', 'GDMNBJWZBNQFCDUDPTG4DFLLUT6WPTMALBNX63OIM2YP5RLULTCFCNEA')]: {
    src: '/brand/assets/dicinu-gdmnbjwz.png',
    source:
      "From the issuer's stellar.toml at dicinu.xmint.io, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('EMN', 'GAKIOVTNEZUTBT7EZMGAIGNW536KS7JBPBBLEBN6ZPWKVGW45TDPV74I')]: {
    src: '/brand/assets/emn-gakiovtn.png',
    source:
      "From the issuer's stellar.toml at emine.io, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('ETH', 'GBFXOHVAS43OIWNIO7XLRJAHT3BICFEIKOJLZVXNT572MISM4CMGSOCC')]: {
    src: '/brand/assets/eth-gbfxohva.png',
    source:
      "From the issuer's stellar.toml at ultracapital.xyz, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('EURC', 'GAQRF3UGHBT6JYQZ7YSUYCIYWAF4T2SAA5237Q5LIQYJOHHFAWDXZ7NM')]: {
    src: '/brand/assets/eurc-gaqrf3ug.png',
    source:
      "From the issuer's stellar.toml at mykobo.co, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('EURMTL', 'GACKTN5DAZGWXRWB2WLM6OPBDHAMT6SJNGLJZPQMEZBUR4JUGBX2UK7V')]: {
    src: '/brand/assets/eurmtl-gacktn5d.png',
    source:
      "From the issuer's stellar.toml at mtlf.me, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('FRED', 'GCA73U2PZFWAXJSNVMEVPNPPJCZGETWPWZC6E4DJAIWP3ZW3BAGYZLV6')]: {
    src: '/brand/assets/fred-gca73u2p.png',
    source:
      "From the issuer's stellar.toml at fredenergy.org, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('Fucupcakes', 'GAYLMXU2ACEUZCHCFZM4OAIUJCJTU6QZBWUTVRGOB5JHLWKNVGNP2P6B')]: {
    src: '/brand/assets/fucupcakes-gaylmxu2.png',
    source:
      "From the issuer's stellar.toml at Justdumbmemes.com, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('FUNT', 'GBUYUAI75XXWDZEKLY66CFYKQPET5JR4EENXZBUZ3YXZ7DS56Z4OKOFU')]: {
    src: '/brand/assets/funt-gbuyuai7.png',
    source:
      "From the issuer's stellar.toml at funtracker.site, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('GOLD', 'GBC5ZGK6MQU3XG5Y72SXPA7P5R5NHYT2475SNEJB2U3EQ6J56QLVGOLD')]: {
    src: '/brand/assets/gold-gbc5zgk6.png',
    source:
      "From the issuer's stellar.toml at mintx.co, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('GOLD', 'GBCB4WO6J4ET55RWK2SVX76LUQ4PQ7TCDHG2YFILQML7D6XR3HACLXAU')]: {
    src: '/brand/assets/gold-gbcb4wo6.png',
    source:
      "From the issuer's stellar.toml at xau.cl, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('GQX', 'GD7TC72O5HML5UMZXQCIXGBR4KJ3MYM2ICPOR4BBN56K6JUSRVWTDAQF')]: {
    src: '/brand/assets/gqx-gd7tc72o.png',
    source:
      "From the issuer's stellar.toml at kingtroll.stellarmint.io, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('GYEN', 'GDF6VOEGRWLOZ64PQQGKD2IYWA22RLT37GJKS2EJXZHT2VLAGWLC5TOB')]: {
    src: '/brand/assets/gyen-gdf6voeg.png',
    source:
      "From the issuer's stellar.toml at stablecoin.z.com, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('GZC', 'GCGZCF3IK52DJ6JAFAMDQUGSSTFXNCCLZI5YL2WQZ4SJ4B66T4FRIGZC')]: {
    src: '/brand/assets/gzc-gcgzcf3i.png',
    source:
      "From the issuer's stellar.toml at gzconstellation.com, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('IDRT', 'GDPKQ2TSNJOFSEE7XSUXPWRP27H6GFGLWD7JCHNEYYWQVGFA543EVBVT')]: {
    src: '/brand/assets/idrt-gdpkq2ts.png',
    source:
      "From the issuer's stellar.toml at kbtrading.org, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('Indocoin', 'GDJZKTSK7S5C5ATFX5JCPXW4IBF55XHWMWLDHA5XK6WJEW6NL2RPFTSS')]: {
    src: '/brand/assets/indocoin-gdjzktsk.png',
    source:
      "From the issuer's stellar.toml at indocoin.cash, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('JDMC', 'GDZ7MGCU3TH4EVXU6S7EZSCRH6VCL36L4Q436MNVLEEFFVXRLRMHGZX2')]: {
    src: '/brand/assets/jdmc-gdz7mgcu.png',
    source:
      "From the issuer's stellar.toml at justdumbmemes.com, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('LFI', 'GDX4QYQYGNMZXFTYLFZWUJSP32ASCBVQVOIRV55IVMDZKTRSYGZ3TWNJ')]: {
    src: '/brand/assets/lfi-gdx4qyqy.png',
    source:
      "From the issuer's stellar.toml at donttreadtoken.com, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('LTC', 'GBVOL67TMUQBGL4TZYNMY3ZQ5WGQYFPFD5VJRWXR72VA33VFNL225PL5')]: {
    src: '/brand/assets/ltc-gbvol67t.png',
    source:
      "From the issuer's stellar.toml at stellarport.io, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('neco', 'GB5NWTBDWP4S5YEPLXOPAUFAENOK7KM3Q6ZFZ55TGGQYIZEPFT22OL4S')]: {
    src: '/brand/assets/neco-gb5nwtbd.png',
    source:
      "From the issuer's stellar.toml at neurotems-coin.site, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('PAYBO', 'GDNUDY5LNUVCO55LLK6H2RCOILB6EO7UOVAOGDTV3FB7Y2U45TMAXD3D')]: {
    src: '/brand/assets/paybo-gdnudy5l.png',
    source:
      "From the issuer's stellar.toml at paybo.club, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('PYBC', 'GBVB43NLVIP2USHXSKI7QQCZKZU2Z6U6A5PAHMIW7LLNVMQJTOX2BZI5')]: {
    src: '/brand/assets/pybc-gbvb43nl.png',
    source:
      "From the issuer's stellar.toml at luxpayband.io, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('Ral', 'GDIPUPLA4BOINFWB4TQURSOUCGSUYTCB7BC6XBXH7ZRY454R2GN2UTHV')]: {
    src: '/brand/assets/ral-gdipupla.png',
    source:
      "From the issuer's stellar.toml at rallets.xmint.io, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('REAL8', 'GBVYYQ7XXRZW6ZCNNCL2X2THNPQ6IM4O47HAA25JTAG7Z3CXJCQ3W4CD')]: {
    src: '/brand/assets/real8-gbvyyq7x.png',
    source:
      "From the issuer's stellar.toml at real8.org, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('SHX', 'GDSTRSHXHGJ7ZIVRBXEYE5Q74XUVCUSEKEBR7UCHEUUEK72N7I7KJ6JH')]: {
    src: '/brand/assets/shx-gdstrshx.png',
    source:
      "From the issuer's stellar.toml at stronghold.co, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('SLVR', 'GBZVELEQD3WBN3R3VAG64HVBDOZ76ZL6QPLSFGKWPFED33Q3234NSLVR')]: {
    src: '/brand/assets/slvr-gbzveleq.png',
    source:
      "From the issuer's stellar.toml at mintx.co, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('SOLS', 'GAWTJMZIR4KPCZ7BQZK6QRAJYT6FOIM3YP2MKGWOYHPJYQQOIEJWFRED')]: {
    src: '/brand/assets/sols-gawtjmzi.png',
    source:
      "From the issuer's stellar.toml at solsbank.com, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('SSLX', 'GBHFGY3ZNEJWLNO4LBUKLYOCEK4V7ENEBJGPRHHX7JU47GWHBREH37UR')]: {
    src: '/brand/assets/sslx-gbhfgy3z.png',
    source:
      "From the issuer's stellar.toml at sslx.sl8.online, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('sUSD', 'GCHW7CWI7GMIYQYFXMFJNJX5645XGWIINIAEQK3SABQO6CAYL5T7JYIH')]: {
    src: '/brand/assets/susd-gchw7cwi.png',
    source:
      "From the issuer's stellar.toml at synt.tech, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('TFT', 'GBOVQKJYHXRR3DX6NOX2RRYFRCUMSADGDESTDNBDS6CDVLGVESRTAC47')]: {
    src: '/brand/assets/tft-gbovqkjy.png',
    source:
      "From the issuer's stellar.toml at threefold.io, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('TREAD', 'GANMKTF7SVYEHZ4CTLRKT2MG2OUJNDEA3JGZGTUTHQZOZSWJHHUF6VLM')]: {
    src: '/brand/assets/tread-ganmktf7.png',
    source:
      "From the issuer's stellar.toml at donttreadtoken.com, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('UAF', 'GDT5EUZMXIABSKZAQA4HNTWYOJI2D64DATP6KNVTV4WDZJ3K7FZDRC5E')]: {
    src: '/brand/assets/uaf-gdt5euzm.png',
    source:
      "From the issuer's stellar.toml at uaf.sl8.online, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('USDGLO', 'GBBS25EGYQPGEZCGCFBKG4OAGFXU6DSOQBGTHELLJT3HZXZJ34HWS6XV')]: {
    src: '/brand/assets/usdglo-gbbs25eg.png',
    source:
      "From the issuer's stellar.toml at app.glodollar.org, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('USDM', 'GDHDC4GBNPMENZAOBB4NCQ25TGZPDRK6ZGWUGSI22TVFATOLRPSUUSDM')]: {
    src: '/brand/assets/usdm-gdhdc4gb.png',
    source:
      "From the issuer's stellar.toml at mtlf.me, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('USDT', 'GCQTGZQQ5G4PTM2GL7CDIFKUBIPEC52BROAQIAPW53XBRJVN6ZJVTG6V')]: {
    src: '/brand/assets/usdt-gcqtgzqq.svg',
    source:
      "From the issuer's stellar.toml at dead.apay.io, which lists this issuer; fetched 16 November 2026.",
  },
  [assetId('USDx', 'GAVH5ZWACAY2PHPUG4FL3LHHJIYIHOFPSIUGM2KHK25CJWXHAV6QKDMN')]: {
    src: '/brand/assets/usdx-gavh5zwa.png',
    source:
      "From the issuer's stellar.toml at assets.fxdao.io, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('USDZ', 'GAKTLPC4ZV37SSCITQ5IS5AQ4WPF4CF4VZJQPPAROSGXMYOATF5U6XPR')]: {
    src: '/brand/assets/usdz-gaktlpc4.png',
    source:
      "From the issuer's stellar.toml at zeam.money, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('VAQM', 'GC2BHMM5X2OYOVQPYC3PZ4SJ5BFF52QFWF2NRXFDOJ4NIS47PU5QBVCD')]: {
    src: '/brand/assets/vaqm-gc2bhmm5.png',
    source:
      "From the issuer's stellar.toml at vaqm.io, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('XAG', 'GB4I3O6EGAQU2HV62DKBPQXBCQVSCUHB3TLOGEPTVKFCZMPNGKYCLXAG')]: {
    src: '/brand/assets/xag-gb4i3o6e.png',
    source:
      "From the issuer's stellar.toml at xag.cl, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('XAU', 'GBCB4WO6J4ET55RWK2SVX76LUQ4PQ7TCDHG2YFILQML7D6XR3HACLXAU')]: {
    src: '/brand/assets/xau-gbcb4wo6.png',
    source:
      "From the issuer's stellar.toml at xau.cl, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('XH5', 'GA6N7EVPWJL4266JTJN52TRIRPDAKMUJWFZ5Q2RN4Z23KXCKPUTURFBF')]: {
    src: '/brand/assets/xh5-ga6n7evp.png',
    source:
      "From the issuer's stellar.toml at cleanshave.org, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('XLMFISHz', 'GBLLGU7TWV4QKUKNQ7IAXC7VA55PLBY7LZSAKUQW2WBLUVHI3475SLGZ')]: {
    src: '/brand/assets/xlmfishz-gbllgu7t.png',
    source:
      "From the issuer's stellar.toml at meme.xlm.fish, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('XRF', 'GCHI6I3X62ND5XUMWINNNKXS2HPYZWKFQBZZYBSMHJ4MIP2XJXSZTXRF')]: {
    src: '/brand/assets/xrf-gchi6i3x.svg',
    source:
      "From the issuer's stellar.toml at reflector.network, which lists this issuer; fetched 16 November 2026.",
  },
  [assetId('XRP', 'GBXRPL45NPHCVMFFAYZVUVFFVKSIZ362ZXFP7I2ETNQ3QKZMFLPRDTD5')]: {
    src: '/brand/assets/xrp-gbxrpl45.png',
    source:
      "From the issuer's stellar.toml at fchain.io, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('xRUNES', 'GCLQS7XDYZN4KPW5STJVVLHSSYH5DYBQXDCMZG5PCWBGTX2EAUI54ZCS')]: {
    src: '/brand/assets/xrunes-gclqs7xd.png',
    source:
      "From the issuer's stellar.toml at runebase.io, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('XTAR', 'GAORYJ3KBDGIM7FFSKVUJHJ5NEFWIRDIAGGBJBJS7TY6ECZS53257IG4')]: {
    src: '/brand/assets/xtar-gaoryj3k.png',
    source:
      "From the issuer's stellar.toml at dogstarcoin.com, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('yUSDC', 'GDGTVWSM4MGS4T7Z6W4RPWOCHE2I6RDFCIFZGS3DOA63LWQTRNZNTTFF')]: {
    src: '/brand/assets/yusdc-gdgtvwsm.png',
    source:
      "From the issuer's stellar.toml at ultracapital.xyz, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
  [assetId('yXLM', 'GARDNV3Q7YGT4AKSDF25LT32YSCCW4EV22Y2TV3I2PU2MMXJTEDL5T55')]: {
    src: '/brand/assets/yxlm-gardnv3q.png',
    source:
      "From the issuer's stellar.toml at ultracapital.xyz, which lists this issuer; fetched 16 November 2026. Resized to at most 128 px.",
  },
};

/**
 * The icon for an asset, or null for a monogram. Native XLM is the asset with no
 * issuer and the code XLM; an issued asset coded XLM is an ordinary asset.
 */
export function assetIcon(code: string, issuer: string | null): AssetIcon | null {
  if (issuer === null) return code === 'XLM' ? STELLAR_MARK : null;
  return ICONS[assetId(code, issuer)] ?? null;
}

/**
 * Logos of venues the landing page names, which are not assets and so never go
 * through `assetIcon`. Each says where it came from.
 */
export const VENUE_ICONS = {
  blend: {
    src: '/brand/venues/blend.png',
    source:
      "Blend's own site icon, from blend.capital (192 px), fetched 16 November 2026. Resized to 128 px.",
  },
} as const satisfies Record<string, AssetIcon>;

/**
 * Every icon stored here, the Stellar mark first. For decoration that shows some of the
 * monitored assets at once; anything about one asset goes through `assetIcon`.
 */
export const STORED_ICONS: readonly AssetIcon[] = [STELLAR_MARK, ...Object.values(ICONS)];
