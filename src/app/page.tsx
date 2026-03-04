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

      {/* Informational sections for SEO and user education */}
      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">What is Kalshi?</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Kalshi is a federally regulated prediction market exchange where
            traders buy and sell contracts on the outcome of real-world events.
            Regulated by the CFTC (Commodity Futures Trading Commission), Kalshi
            lets you trade on topics ranging from politics and economics to
            sports, crypto prices, and weather.
          </p>
          <p>
            Each contract is priced between 1&cent; and 99&cent; and pays out
            $1.00 if the event occurs or $0.00 if it doesn&apos;t. The market
            price reflects the crowd&apos;s real-time estimate of the
            probability of an outcome — a contract trading at 72&cent; implies
            roughly a 72% chance the event happens.
          </p>
          <p>
            Unlike traditional polling or pundit predictions, Kalshi prices are
            backed by real money, giving them a unique signal about how
            participants actually assess risk and probability.
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">How To Use Kalshi Signals</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Kalshi Signals tracks the largest individual trades happening across
            every active market on Kalshi, updated in real time. When someone
            places an unusually large bet — often hundreds or thousands of
            dollars on a single contract — it can indicate strong conviction
            about an outcome.
          </p>
          <p>
            Use this data to spot where informed money is flowing. A surge of
            large &ldquo;Yes&rdquo; trades on a market may signal growing
            confidence that an event will happen, while large &ldquo;No&rdquo;
            trades suggest the opposite. Combined with price changes and volume,
            these signals help you identify markets with meaningful activity
            before they make headlines.
          </p>
          <p>
            This tool is for informational and research purposes only. It does
            not constitute financial advice. Always do your own research before
            making any trading decisions.
          </p>
        </div>
      </section>
    </div>
  );
}
