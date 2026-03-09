import { getAllTrades, getMarket } from "@/lib/kalshi";
import { sumTradesByTicker, buildInflows } from "@/lib/signals";
import { PopularTable } from "@/components/popular-table";
import { TrendingUp } from "lucide-react";
import { RefreshButton } from "@/components/refresh-button";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export default async function MostPopularPage() {
  let inflows: import("@/lib/signals").MarketInflow[] = [];
  let totalTickers = 0;
  let error: string | null = null;
  const fetchedAt = new Date();

  try {
    const trades = await getAllTrades();
    const tradeSums = sumTradesByTicker(trades);
    totalTickers = tradeSums.size;

    const topTickers = [...tradeSums.entries()]
      .sort((a, b) => (b[1].yesDollars + b[1].noDollars) - (a[1].yesDollars + a[1].noDollars))
      .slice(0, 200)
      .map(([ticker]) => ticker);

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

    inflows = buildInflows(markets, tradeSums);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load market data";
    inflows = [];
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-chart-1" />
            Most Popular Markets
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Markets ranked by total cash inflow — showing where the most money
            is being traded, split by Yes and No positions.
          </p>
        </div>
        <RefreshButton />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {inflows.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Top {inflows.length} from {totalTickers.toLocaleString()} traded markets
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated: {fetchedAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/New_York" })} ET
            </p>
          </div>
          <PopularTable inflows={inflows} />
        </div>
      )}

      {!error && inflows.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No active markets found. Markets may be closed or inactive.
        </div>
      )}
    </div>
  );
}
