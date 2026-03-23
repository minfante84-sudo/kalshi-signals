import { getAllMarkets } from "@/lib/kalshi";
import { NewMarketsTable } from "@/components/new-markets-table";
import { Sparkles } from "lucide-react";
import { RefreshButton } from "@/components/refresh-button";

export const dynamic = "force-dynamic";
export const revalidate = 30;
export const maxDuration = 60;

export default async function NewMarketsPage() {
  let markets: import("@/lib/kalshi").KalshiMarket[] = [];
  let error: string | null = null;
  const fetchedAt = new Date();

  try {
    const allMarkets = await getAllMarkets({
      status: "open",
      mve_filter: "exclude",
      maxPages: 5,
    });
    // Sort by created_time descending (newest first) and take top 200
    markets = allMarkets
      .sort((a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime())
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
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-chart-1" />
            New Markets
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Recently listed markets on Kalshi — see what new events are
            available for trading.
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
              {markets.length} newest markets
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated: {fetchedAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/New_York" })} ET
            </p>
          </div>
          <NewMarketsTable markets={markets} />
        </div>
      )}

      {!error && markets.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No new markets found.
        </div>
      )}

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">How to Read New Markets</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            This table shows the most recently listed markets on Kalshi, sorted by
            listing date. New markets give you the chance to form a view before the
            crowd arrives and prices settle, which can mean better entry points if
            you have early conviction on an outcome.
          </p>
          <p>
            <strong className="text-foreground">Listed</strong> tells you how long
            ago the market was created. Markets listed minutes or hours ago may still
            be finding their initial price, while markets a day or two old have
            usually begun to attract steady trading activity.
          </p>
          <p>
            <strong className="text-foreground">Price</strong> is the last traded
            price in cents and serves as the market&apos;s current implied probability.
            On brand-new markets, the price can be volatile — a small number of early
            trades can move it significantly before deeper liquidity builds up.
          </p>
          <p>
            <strong className="text-foreground">Bid / Ask</strong> shows the best
            available buy and sell prices. The gap between them — the spread — tells
            you about liquidity. A tight spread (e.g., 48&cent; / 52&cent;) means you
            can enter or exit close to the current price. A wide spread (e.g.,
            30&cent; / 70&cent;) means the market is thin and you may want to use
            limit orders rather than market orders.
          </p>
          <p>
            <strong className="text-foreground">Volume</strong> shows how many
            contracts have traded. Low volume on a new market is expected, but watch
            for markets where volume is climbing quickly — that early interest often
            signals a market that is about to become widely followed.
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
