import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMarket, getOrderbook, getTrades, getSeries } from "@/lib/kalshi";
import { formatNumber, formatPercent, formatDollars } from "@/lib/signals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OrderBook } from "@/components/order-book";
import { TradeList } from "@/components/trade-list";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";

export const revalidate = 15;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticker: string }>;
}): Promise<Metadata> {
  const { ticker } = await params;
  try {
    const { market } = await getMarket(ticker);
    return {
      title: market.title,
      description: market.rules_primary
        ? market.rules_primary.split(/\.\s/)[0]
        : `Live trading data for ${market.title} on Kalshi — price ${market.last_price}\u00A2, volume ${market.volume_24h} contracts.`,
    };
  } catch {
    return { title: ticker };
  }
}

export default async function MarketDetailPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;

  let market, orderbook, trades;
  let kalshiUrl = "https://kalshi.com";

  try {
    const [marketRes, orderbookRes, tradesRes] = await Promise.all([
      getMarket(ticker),
      getOrderbook(ticker),
      getTrades({ ticker, limit: 30 }),
    ]);
    market = marketRes.market;
    orderbook = orderbookRes.orderbook;
    trades = tradesRes.trades;

    // Build the Kalshi market URL: /markets/{series}/{slug}/{event}
    try {
      const seriesTicker = market.event_ticker.replace(/-.*$/, "");
      const { series } = await getSeries(seriesTicker);
      const slug = series.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      kalshiUrl = `https://kalshi.com/markets/${seriesTicker.toLowerCase()}/${slug}/${market.event_ticker.toLowerCase()}`;
    } catch {
      // Fallback to search
      kalshiUrl = `https://kalshi.com/browse?search=${encodeURIComponent(market.title)}`;
    }
  } catch {
    notFound();
  }

  const prevPrice = market.previous_price || market.last_price;
  const priceChange = market.last_price - prevPrice;
  const priceChangePct = prevPrice > 0 ? (priceChange / prevPrice) * 100 : 0;
  const isUp = priceChangePct > 0;
  const isDown = priceChangePct < 0;

  // Find the largest single trade
  const largestTrade = trades.reduce<{
    dollars: number;
    contracts: number;
    side: string;
    price: number;
    time: string;
  } | null>((best, t) => {
    const priceCents = t.taker_side === "yes" ? t.yes_price : t.no_price;
    const dollars = t.count * (priceCents / 100);
    if (!best || dollars > best.dollars) {
      return { dollars, contracts: t.count, side: t.taker_side, price: priceCents, time: t.created_time };
    }
    return best;
  }, null);

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Signals
      </Link>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold">{market.title}</h1>
            <Badge variant="outline" className="mt-1 shrink-0">
              {market.status}
            </Badge>
          </div>
          <a
            href={kalshiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 shrink-0 rounded-md bg-blue-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-blue-700 transition-colors self-start"
          >
            Trade on Kalshi
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        {market.rules_primary && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {market.rules_primary}
          </p>
        )}
        <div className="flex flex-wrap gap-4 text-sm">
          {market.yes_sub_title && market.yes_sub_title !== market.title && (
            <div className="rounded-md border border-green-500/30 bg-green-500/10 px-3 py-1.5">
              <span className="font-medium text-green-600">Yes:</span>{" "}
              {market.yes_sub_title}
            </div>
          )}
          {market.no_sub_title && market.no_sub_title !== market.title && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5">
              <span className="font-medium text-red-600">No:</span>{" "}
              {market.no_sub_title}
            </div>
          )}
        </div>
      </div>

      {/* Largest trade signal */}
      {largestTrade && (
        <Card className={`border-2 ${largestTrade.side === "yes" ? "border-green-500/40 bg-green-500/5" : "border-red-500/40 bg-red-500/5"}`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${largestTrade.side === "yes" ? "bg-green-500" : "bg-red-500"}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${largestTrade.side === "yes" ? "bg-green-500" : "bg-red-500"}`} />
              </span>
              Largest Recent Trade
            </div>
            <div className="flex flex-wrap items-baseline gap-x-4 sm:gap-x-6 gap-y-2">
              <span className="text-2xl sm:text-3xl font-bold">{formatDollars(largestTrade.dollars)}</span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-semibold ${largestTrade.side === "yes" ? "bg-green-500/15 text-green-600" : "bg-red-500/15 text-red-600"}`}>
                {largestTrade.side === "yes" ? "Yes" : "No"} @ {largestTrade.price}&cent;
              </span>
              <span className="text-sm text-muted-foreground">
                {formatNumber(largestTrade.contracts)} contracts
              </span>
              <span className="text-sm text-muted-foreground">
                {new Date(largestTrade.time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/New_York" })} ET
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold">
                {market.last_price}&cent;
              </span>
              <span
                className={`flex items-center text-sm font-medium ${isUp ? "text-green-500" : isDown ? "text-red-500" : "text-muted-foreground"}`}
              >
                {isUp && <ArrowUpRight className="h-4 w-4" />}
                {isDown && <ArrowDownRight className="h-4 w-4" />}
                {formatPercent(priceChangePct)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bid / Ask
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl sm:text-3xl font-bold">
              {market.yes_bid} / {market.yes_ask}
            </span>
            <p className="mt-1 text-xs text-muted-foreground">
              Spread: {market.yes_ask - market.yes_bid}&cent;
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Volume (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl sm:text-3xl font-bold">
              {formatNumber(market.volume_24h)}
            </span>
            <p className="mt-1 text-xs text-muted-foreground">
              All-time: {formatNumber(market.volume)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Interest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl sm:text-3xl font-bold">
              {formatNumber(market.open_interest)}
            </span>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Order Book + Trades */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Book</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderBook orderbook={orderbook} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <TradeList trades={trades} />
          </CardContent>
        </Card>
      </div>

      {/* Market info */}
      <Card>
        <CardHeader>
          <CardTitle>Market Info</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Event</dt>
              <dd className="font-medium">{market.event_ticker}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Type</dt>
              <dd className="font-medium capitalize">{market.market_type}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Closes</dt>
              <dd className="font-medium">
                {new Date(market.close_time).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Created</dt>
              <dd className="font-medium">
                {new Date(market.created_time).toLocaleString()}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
