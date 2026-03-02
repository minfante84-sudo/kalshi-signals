import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketSignal, formatDollars, formatPercent } from "@/lib/signals";
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, BarChart3 } from "lucide-react";

export function SignalCard({ signal }: { signal: MarketSignal }) {
  const { market, priceChangePct, volume24h, openInterest, signalType, signalStrength } = signal;

  const trendIcon =
    signalType === "bullish" ? (
      <ArrowUpRight className="h-4 w-4 text-green-500" />
    ) : signalType === "bearish" ? (
      <ArrowDownRight className="h-4 w-4 text-red-500" />
    ) : (
      <Minus className="h-4 w-4 text-muted-foreground" />
    );

  const strengthColor =
    signalStrength === "strong"
      ? "bg-chart-1 text-white"
      : signalStrength === "moderate"
        ? "bg-chart-4 text-black"
        : "bg-muted text-muted-foreground";

  const priceChangeColor =
    priceChangePct > 0
      ? "text-green-500"
      : priceChangePct < 0
        ? "text-red-500"
        : "text-muted-foreground";

  return (
    <Link href={`/market/${market.ticker}`}>
      <Card className="transition-colors hover:bg-accent/50 cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-medium leading-tight line-clamp-2">
              {market.title}
            </CardTitle>
            <Badge className={strengthColor} variant="secondary">
              {signalStrength}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{market.ticker}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-lg font-semibold">
                {(market.last_price_dollars * 100).toFixed(0)}&cent;
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">24h Change</p>
              <div className="flex items-center gap-1">
                {trendIcon}
                <p className={`text-lg font-semibold ${priceChangeColor}`}>
                  {formatPercent(priceChangePct)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="text-lg font-semibold">{signal.signalScore}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              Vol: {formatDollars(volume24h)}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              OI: {formatDollars(openInterest)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
