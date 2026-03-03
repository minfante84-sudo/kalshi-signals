import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketSignal, formatDollars, formatNumber, formatPercent } from "@/lib/signals";
import { ArrowUpRight, ArrowDownRight, Minus, DollarSign, BarChart3 } from "lucide-react";

export function SignalCard({ signal }: { signal: MarketSignal }) {
  const { market, largestTrade, priceChangePct, volume24h, signalStrength } = signal;

  const priceChangeColor =
    priceChangePct > 0
      ? "text-green-500"
      : priceChangePct < 0
        ? "text-red-500"
        : "text-muted-foreground";

  const strengthLabel =
    signalStrength === "high"
      ? "High Inflow"
      : signalStrength === "moderate"
        ? "Moderate Inflow"
        : "Low Inflow";

  const strengthColor =
    signalStrength === "high"
      ? "bg-chart-1 text-white"
      : signalStrength === "moderate"
        ? "bg-chart-4 text-black"
        : "bg-muted text-muted-foreground";

  return (
    <Link href={`/market/${market.ticker}`}>
      <Card className="transition-colors hover:bg-accent/50 cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-medium leading-tight line-clamp-2">
              {market.title}
            </CardTitle>
            <Badge className={strengthColor} variant="secondary">
              {strengthLabel}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{market.ticker}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Largest Trade</p>
              <p className="text-lg font-semibold">{formatDollars(largestTrade)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Volume 24h</p>
              <p className="text-lg font-semibold">{formatNumber(volume24h)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-lg font-semibold">
                {market.last_price}&cent;
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className={priceChangeColor}>{formatPercent(priceChangePct)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
