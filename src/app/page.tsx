import { getMarkets } from "@/lib/kalshi";
import { computeSignals } from "@/lib/signals";
import { SignalCard } from "@/components/signal-card";
import { MarketTable } from "@/components/market-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity } from "lucide-react";

export const revalidate = 30;

export default async function SignalsDashboard() {
  let signals: import("@/lib/signals").MarketSignal[] = [];
  let error: string | null = null;

  try {
    const { markets } = await getMarkets({ limit: 200 });
    signals = computeSignals(markets);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load market data";
    signals = [];
  }

  const topSignals = signals.slice(0, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Activity className="h-6 w-6 text-chart-1" />
          Market Signals
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Markets ranked by unusual activity — large price moves and volume
          spikes across Kalshi prediction markets.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {topSignals.length > 0 && (
        <Tabs defaultValue="cards">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing top {topSignals.length} signals from {signals.length}{" "}
              active markets
            </p>
            <TabsList>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="cards" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topSignals.map((signal) => (
                <SignalCard key={signal.market.ticker} signal={signal} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="table" className="mt-4">
            <MarketTable signals={topSignals} />
          </TabsContent>
        </Tabs>
      )}

      {!error && topSignals.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No active signals found. Markets may be closed or inactive.
        </div>
      )}
    </div>
  );
}
