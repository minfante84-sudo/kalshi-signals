import { NextRequest, NextResponse } from "next/server";
import { getAllTrades, getMarket } from "@/lib/kalshi";
import { rankTradesByTicker, buildSignals } from "@/lib/signals";
import { saveSnapshot, SnapshotEntry } from "@/lib/snapshots";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const trades = await getAllTrades();
    const tradeRanks = rankTradesByTicker(trades);

    // Sort tickers by largest trade descending, take top 50
    const topTickers = [...tradeRanks.entries()]
      .sort((a, b) => b[1].dollars - a[1].dollars)
      .slice(0, 50)
      .map(([ticker]) => ticker);

    // Fetch full market details in batches of 50
    const markets: import("@/lib/kalshi").KalshiMarket[] = [];
    for (let i = 0; i < topTickers.length; i += 50) {
      const batch = topTickers.slice(i, i + 50);
      const results = await Promise.all(
        batch.map(async (ticker) => {
          try {
            const { market } = await getMarket(ticker);
            return market;
          } catch {
            return null;
          }
        })
      );
      markets.push(...results.filter((m) => m !== null));
      if (i + 50 < topTickers.length) {
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    const signals = buildSignals(markets, tradeRanks);
    const today = new Date().toISOString().slice(0, 10);

    const entries: SnapshotEntry[] = signals.map((s) => ({
      ticker: s.market.ticker,
      event_ticker: s.market.event_ticker,
      title: s.market.title,
      last_price: s.market.last_price,
      previous_price: s.market.previous_price,
      largestTrade: s.largestTrade,
      largestTradeContracts: s.largestTradeContracts,
      largestTradeSide: s.largestTradeSide,
      priceChange: s.priceChange,
      priceChangePct: s.priceChangePct,
      volume24h: s.volume24h,
      openInterest: s.openInterest,
      signalStrength: s.signalStrength,
    }));

    await saveSnapshot(today, entries);

    return NextResponse.json({
      ok: true,
      date: today,
      count: entries.length,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
