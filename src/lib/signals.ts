import { KalshiMarket, KalshiTrade } from "./kalshi";

export interface MarketSignal {
  market: KalshiMarket;
  largestTrade: number; // dollar value of the biggest single trade
  largestTradeContracts: number; // contract count of the biggest single trade
  largestTradeSide: "yes" | "no"; // which side the largest trade was on
  priceChange: number;
  priceChangePct: number;
  volume24h: number;
  openInterest: number;
  signalStrength: "high" | "moderate" | "low";
}

/** Compute the largest single trade per ticker from raw trades. */
export function rankTradesByTicker(
  trades: KalshiTrade[]
): Map<string, { dollars: number; contracts: number; side: "yes" | "no" }> {
  const map = new Map<string, { dollars: number; contracts: number; side: "yes" | "no" }>();

  for (const trade of trades) {
    const priceCents =
      trade.taker_side === "yes" ? trade.yes_price : trade.no_price;
    const dollars = trade.count * (priceCents / 100);
    const existing = map.get(trade.ticker);
    if (!existing || dollars > existing.dollars) {
      map.set(trade.ticker, { dollars, contracts: trade.count, side: trade.taker_side as "yes" | "no" });
    }
  }

  return map;
}

/** Build signals from enriched markets + pre-ranked trade data. */
export function buildSignals(
  markets: KalshiMarket[],
  tradeRanks: Map<string, { dollars: number; contracts: number; side: "yes" | "no" }>
): MarketSignal[] {
  const signals: MarketSignal[] = [];

  for (const market of markets) {
    const largest = tradeRanks.get(market.ticker);
    if (!largest || market.last_price <= 0) continue;
    // Exclude parlays with more than 4 legs
    if (market.title.split(",").length > 4) continue;

    const lastPrice = market.last_price;
    const prevPrice = market.previous_price || lastPrice;
    const priceChange = lastPrice - prevPrice;
    const priceChangePct =
      prevPrice > 0 ? (priceChange / prevPrice) * 100 : 0;
    const vol = market.volume_24h || market.volume;

    const signalStrength: MarketSignal["signalStrength"] =
      largest.dollars >= 1000
        ? "high"
        : largest.dollars >= 100
          ? "moderate"
          : "low";

    signals.push({
      market,
      largestTrade: largest.dollars,
      largestTradeContracts: largest.contracts,
      largestTradeSide: largest.side,
      priceChange,
      priceChangePct,
      volume24h: vol,
      openInterest: market.open_interest,
      signalStrength,
    });
  }

  return signals.sort((a, b) => b.largestTrade - a.largestTrade);
}

export interface MarketInflow {
  market: KalshiMarket;
  yesDollars: number;
  noDollars: number;
  totalDollars: number;
  tradeCount: number;
}

/** Sum all trade dollars per ticker, split by yes/no side. */
export function sumTradesByTicker(
  trades: KalshiTrade[]
): Map<string, { yesDollars: number; noDollars: number; tradeCount: number }> {
  const map = new Map<string, { yesDollars: number; noDollars: number; tradeCount: number }>();

  for (const trade of trades) {
    const priceCents =
      trade.taker_side === "yes" ? trade.yes_price : trade.no_price;
    const dollars = trade.count * (priceCents / 100);
    const existing = map.get(trade.ticker) ?? { yesDollars: 0, noDollars: 0, tradeCount: 0 };

    if (trade.taker_side === "yes") {
      existing.yesDollars += dollars;
    } else {
      existing.noDollars += dollars;
    }
    existing.tradeCount += 1;

    map.set(trade.ticker, existing);
  }

  return map;
}

/** Build inflow data from markets + aggregated trade sums. */
export function buildInflows(
  markets: KalshiMarket[],
  tradeSums: Map<string, { yesDollars: number; noDollars: number; tradeCount: number }>
): MarketInflow[] {
  const inflows: MarketInflow[] = [];

  for (const market of markets) {
    const sums = tradeSums.get(market.ticker);
    if (!sums || market.last_price <= 0) continue;
    if (market.title.split(",").length > 4) continue;

    inflows.push({
      market,
      yesDollars: sums.yesDollars,
      noDollars: sums.noDollars,
      totalDollars: sums.yesDollars + sums.noDollars,
      tradeCount: sums.tradeCount,
    });
  }

  return inflows.sort((a, b) => b.totalDollars - a.totalDollars);
}

export interface MarketMover {
  market: KalshiMarket;
  priceChange: number;
  absPriceChange: number;
  priceChangePct: number;
  volume24h: number;
}

export function buildMomentum(markets: KalshiMarket[]): MarketMover[] {
  const movers: MarketMover[] = [];

  for (const market of markets) {
    if (market.last_price <= 0 || market.previous_price <= 0) continue;
    if (market.title.split(",").length > 4) continue;

    const priceChange = market.last_price - market.previous_price;
    if (priceChange === 0) continue;

    const priceChangePct = (priceChange / market.previous_price) * 100;

    movers.push({
      market,
      priceChange,
      absPriceChange: Math.abs(priceChange),
      priceChangePct,
      volume24h: market.volume_24h || market.volume,
    });
  }

  return movers.sort((a, b) => b.absPriceChange - a.absPriceChange);
}

export function formatDollars(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
