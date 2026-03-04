import { NextRequest, NextResponse } from "next/server";
import { getAllMarkets } from "@/lib/kalshi";
import { computeSignals } from "@/lib/signals";
import { saveSnapshot, SnapshotEntry } from "@/lib/snapshots";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const markets = await getAllMarkets({ status: "open" });
    const signals = computeSignals(markets);
    const top50 = signals.slice(0, 50);

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const entries: SnapshotEntry[] = top50.map((s) => ({
      ticker: s.market.ticker,
      event_ticker: s.market.event_ticker,
      title: s.market.title,
      last_price: s.market.last_price,
      previous_price: s.market.previous_price,
      priceChange: s.priceChange,
      priceChangePct: s.priceChangePct,
      volume24h: s.volume24h,
      openInterest: s.openInterest,
      signalScore: s.signalScore,
      signalType: s.signalType,
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
