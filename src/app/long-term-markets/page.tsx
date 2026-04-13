import { getAllMarkets } from "@/lib/kalshi";
import { LongTermTable } from "@/components/long-term-table";
import { Calendar } from "lucide-react";
import { RefreshButton } from "@/components/refresh-button";

export const dynamic = "force-dynamic";
export const revalidate = 30;
export const maxDuration = 60;

export default async function LongTermMarketsPage() {
  let markets: import("@/lib/kalshi").KalshiMarket[] = [];
  let totalMarkets = 0;
  let error: string | null = null;
  const fetchedAt = new Date();

  try {
    const allMarkets = await getAllMarkets({
      status: "open",
      mve_filter: "exclude",
    });
    totalMarkets = allMarkets.length;

    const oneWeekFromNow = Date.now() + 7 * 24 * 60 * 60 * 1000;

    markets = allMarkets
      .filter((m) => new Date(m.close_time).getTime() >= oneWeekFromNow)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 200);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load market data";
    markets = [];
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-chart-1" />
            Long-Term Markets
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The most popular markets closing more than a week from now —
            ranked by total volume.
          </p>
        </div>
        <RefreshButton />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {markets.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Top {markets.length} long-term markets from {totalMarkets.toLocaleString()} total
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated: {fetchedAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/New_York" })} ET
            </p>
          </div>
          <LongTermTable markets={markets} />
        </div>
      )}

      {!error && markets.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No long-term markets found. Markets may be closed or inactive.
        </div>
      )}

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">How to Read Long-Term Markets</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            This table shows open markets that close at least one week from now, ranked
            by total all-time volume. These are the markets where the most contracts have
            changed hands, indicating sustained interest and deeper liquidity.
          </p>
          <p>
            <strong className="text-foreground">Ends In</strong> shows how much time
            remains before the market closes. Long-term markets give you more time to
            build a position and react to new information, but prices can also be slower
            to move since the resolution date is further away.
          </p>
          <p>
            <strong className="text-foreground">Volume</strong> is the total number of
            contracts traded over the lifetime of the market. High volume means the
            market has attracted significant attention and generally offers tighter
            spreads and easier entry and exit.
          </p>
          <p>
            <strong className="text-foreground">24h Vol</strong> shows recent activity.
            A long-term market with a spike in 24-hour volume may be responding to
            breaking news or a catalyst — worth investigating even if the close date
            is months away.
          </p>
          <p>
            <strong className="text-foreground">Price</strong> reflects the market&apos;s
            current implied probability. Compare it with the bid/ask spread to gauge
            how confident the market is and whether there is room to get a better entry
            with a limit order.
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
