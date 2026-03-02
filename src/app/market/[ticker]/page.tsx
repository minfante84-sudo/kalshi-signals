import { notFound } from "next/navigation";
import Link from "next/link";
import { getMarket, getOrderbook, getTrades } from "@/lib/kalshi";
import { formatNumber, formatPercent } from "@/lib/signals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OrderBook } from "@/components/order-book";
import { TradeList } from "@/components/trade-list";
import { ArrowLeft, ArrowUpRight, ArrowDownRight } from "lucide-react";

export const revalidate = 15;

export default async function MarketDetailPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;

  let market, orderbook, trades;

  try {
    const [marketRes, orderbookRes, tradesRes] = await Promise.all([
      getMarket(ticker),
      getOrderbook(ticker),
      getTrades({ ticker, limit: 30 }),
    ]);
    market = marketRes.market;
    orderbook = orderbookRes.orderbook;
    trades = tradesRes.trades;
  } catch {
    notFound();
  }

  const prevPrice = market.previous_price || market.last_price;
  const priceChange = market.last_price - prevPrice;
  const priceChangePct = prevPrice > 0 ? (priceChange / prevPrice) * 100 : 0;
  const isUp = priceChangePct > 0;
  const isDown = priceChangePct < 0;

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Signals
      </Link>

      <div>
        <div className="flex items-start gap-3">
          <h1 className="text-2xl font-bold">{market.title}</h1>
          <Badge variant="outline" className="mt-1">
            {market.status}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{market.ticker}</p>
      </div>

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
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
            <span className="text-3xl font-bold">
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
            <span className="text-3xl font-bold">
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
            <span className="text-3xl font-bold">
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
