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
    const markets = await getAllMarkets({ status: "open", maxPages: 15 });
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
            Momentum
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
    </div>
  );
}
