import { KalshiMarket } from "./kalshi";

export interface MarketSignal {
  market: KalshiMarket;
  priceChange: number; // absolute price change in cents
  priceChangePct: number; // percentage change
  volume24h: number;
  openInterest: number;
  signalScore: number; // composite score
  signalType: "bullish" | "bearish" | "neutral";
  signalStrength: "strong" | "moderate" | "weak";
}

export function computeSignals(markets: KalshiMarket[]): MarketSignal[] {
  // Filter to markets with meaningful activity (volume > 0 OR has a last price)
  const active = markets.filter(
    (m) => (m.volume > 0 || m.volume_24h > 0) && m.last_price > 0
  );

  if (active.length === 0) return [];

  // Calculate volume percentiles for relative scoring
  const volumes = active.map((m) => m.volume_24h || m.volume).sort((a, b) => a - b);
  const getVolumePercentile = (vol: number) => {
    if (volumes.length <= 1) return 1;
    const idx = volumes.findIndex((v) => v >= vol);
    return idx / volumes.length;
  };

  const signals: MarketSignal[] = active.map((market) => {
    const lastPrice = market.last_price;
    const prevPrice = market.previous_price || lastPrice;
    const priceChange = lastPrice - prevPrice;
    const priceChangePct = prevPrice > 0 ? (priceChange / prevPrice) * 100 : 0;

    const vol = market.volume_24h || market.volume;

    // Volume score: percentile ranking (0-1)
    const volumeScore = getVolumePercentile(vol);

    // Price move score: normalized absolute change (0-1)
    const priceScore = Math.min(Math.abs(priceChangePct) / 30, 1);

    // Composite signal score (0-100)
    const signalScore = Math.round((volumeScore * 40 + priceScore * 60) * 100) / 100;

    // Determine signal type
    const signalType: MarketSignal["signalType"] =
      priceChangePct > 2 ? "bullish" : priceChangePct < -2 ? "bearish" : "neutral";

    // Determine signal strength
    const signalStrength: MarketSignal["signalStrength"] =
      signalScore > 70 ? "strong" : signalScore > 40 ? "moderate" : "weak";

    return {
      market,
      priceChange,
      priceChangePct,
      volume24h: vol,
      openInterest: market.open_interest,
      signalScore,
      signalType,
      signalStrength,
    };
  });

  // Sort by signal score descending
  return signals.sort((a, b) => b.signalScore - a.signalScore);
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
