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

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">How to Read Popular Markets</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            This table ranks markets by <strong className="text-foreground">Total Inflow</strong> —
            the total dollar amount traded in each market over the last 24 hours. Markets
            at the top are attracting the most real-money activity, which often reflects
            breaking news, upcoming events, or shifting public sentiment.
          </p>
          <p>
            <strong className="text-foreground">Yes Inflow</strong> and{" "}
            <strong className="text-foreground">No Inflow</strong> break down the total
            by direction. When one side significantly outweighs the other, it can indicate
            lopsided conviction — traders are piling into one outcome. A market with heavy
            Yes inflow and a rising price suggests growing confidence in that outcome, while
            heavy No inflow signals skepticism.
          </p>
          <p>
            <strong className="text-foreground">Trades</strong> shows how many individual
            transactions have occurred. A high trade count with a low total inflow means
            many small bets, which is typical of retail interest. A low trade count with
            high inflow suggests fewer, larger positions — often a sign of more informed
            or institutional traders.
          </p>
          <p>
            <strong className="text-foreground">Price</strong> reflects the market&apos;s
            current implied probability. A price of 72&cent; roughly means the crowd
            estimates a 72% chance the event happens. Compare the price to the Yes/No
            inflow split to gauge whether the money flow aligns with or diverges from
            the current consensus.
          </p>
          <p>
            Use the column headers to sort by any metric and the search bar to filter
            by market name or ticker. Click any row to see the full market details,
            including an order book and price history.
          </p>
        </div>
      </section>
    </div>
  );
}
