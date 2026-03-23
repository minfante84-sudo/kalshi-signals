import { getAllMarkets } from "@/lib/kalshi";
import { buildMomentum } from "@/lib/signals";
import { MomentumTable } from "@/components/momentum-table";
import { Zap } from "lucide-react";
import { RefreshButton } from "@/components/refresh-button";

export const dynamic = "force-dynamic";
export const revalidate = 30;
export const maxDuration = 60;

export default async function MomentumPage() {
  let movers: import("@/lib/signals").MarketMover[] = [];
  let totalMarkets = 0;
  let error: string | null = null;
  const fetchedAt = new Date();

  try {
    const markets = await getAllMarkets({ status: "open", mve_filter: "exclude" });
    totalMarkets = markets.length;
    movers = buildMomentum(markets);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load market data";
    movers = [];
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-chart-1" />
            Trending
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Markets with the biggest price swings in the last 24 hours —
            showing where prices are moving the most.
          </p>
        </div>
        <RefreshButton />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {movers.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Top {movers.length} from {totalMarkets.toLocaleString()} open markets
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated: {fetchedAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/New_York" })} ET
            </p>
          </div>
          <MomentumTable movers={movers} />
        </div>
      )}

      {!error && movers.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No price movements found. Markets may be closed or inactive.
        </div>
      )}

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">How to Read Trending Markets</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            This table surfaces the markets with the largest price movements over
            the last 24 hours. Markets are ranked by absolute price change, so both
            sharp rises and steep drops appear at the top. These are the markets where
            sentiment is shifting the fastest.
          </p>
          <p>
            <strong className="text-foreground">Price</strong> shows the current
            market price in cents. Since each contract pays out $1.00 or $0.00, the
            price doubles as an implied probability — a price of 65&cent; means the
            crowd estimates roughly a 65% chance the event occurs.
          </p>
          <p>
            <strong className="text-foreground">Change</strong> is the raw cent
            movement over the last 24 hours. A positive number (green) means the
            market has moved toward &ldquo;Yes,&rdquo; while a negative number (red)
            means it has moved toward &ldquo;No.&rdquo; Larger swings often follow
            breaking news, official announcements, or major shifts in public opinion.
          </p>
          <p>
            <strong className="text-foreground">% Change</strong> puts that movement
            in context. A 5&cent; swing on a market priced at 10&cent; is a 50% move
            and far more significant than a 5&cent; swing on a market priced at 80&cent;.
            Sorting by % Change helps you spot outsized moves in lower-priced markets
            that might otherwise go unnoticed.
          </p>
          <p>
            <strong className="text-foreground">Volume 24h</strong> shows how many
            contracts have traded. High volume alongside a big price move adds
            conviction — it means the shift is backed by real trading activity, not
            just a handful of trades in a thin market.
          </p>
          <p>
            Use the column headers to re-sort by any metric and the search bar to
            filter by market name or ticker. Click any row to view full market
            details including price history and the order book.
          </p>
        </div>
      </section>
    </div>
  );
}
