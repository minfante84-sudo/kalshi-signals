import { getAllTrades, getMarket } from "@/lib/kalshi";
import { rankTradesByTicker, buildSignals } from "@/lib/signals";
import { MarketTable } from "@/components/market-table";
import { DollarSign } from "lucide-react";
import { RefreshButton } from "@/components/refresh-button";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export default async function SignalsDashboard() {
  let signals: import("@/lib/signals").MarketSignal[] = [];
  let totalTickers = 0;
  let error: string | null = null;
  const fetchedAt = new Date();

  try {
    const trades = await getAllTrades();
    const tradeRanks = rankTradesByTicker(trades);
    totalTickers = tradeRanks.size;

    // Sort tickers by largest trade descending, cap at 200
    // (sorted first so the biggest bets are always included)
    const topTickers = [...tradeRanks.entries()]
      .sort((a, b) => b[1].dollars - a[1].dollars)
      .slice(0, 200)
      .map(([ticker]) => ticker);

    // Fetch full market details in batches of 50 to avoid rate limits
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

    signals = buildSignals(markets, tradeRanks);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load market data";
    signals = [];
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
            <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-chart-1" />
            Largest Single Trades
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Markets ranked by the biggest individual contract purchases — showing
            where large single bets are being placed across all categories.
          </p>
        </div>
        <RefreshButton />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {signals.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Top {signals.length} from {totalTickers.toLocaleString()} traded markets
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated: {fetchedAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/New_York" })} ET
            </p>
          </div>
          <MarketTable signals={signals} />
        </div>
      )}

      {!error && signals.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No active signals found. Markets may be closed or inactive.
        </div>
      )}
    </div>
  );
}
