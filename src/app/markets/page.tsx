"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatNumber, formatPercent } from "@/lib/signals";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface RawMarket {
  ticker: string;
  event_ticker: string;
  title: string;
  status: string;
  last_price: number | string;
  previous_price: number | string;
  last_price_dollars: number | string;
  previous_price_dollars: number | string;
  volume: number | string;
  volume_24h: number | string;
  volume_24h_fp: number | string;
  open_interest: number | string;
  open_interest_fp: number | string;
}

function toNum(val: unknown): number {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

export default function MarketsPage() {
  const [markets, setMarkets] = useState<RawMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState<string | undefined>();
  const [prevCursors, setPrevCursors] = useState<string[]>([]);

  const fetchMarkets = async (cursorParam?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (cursorParam) params.set("cursor", cursorParam);

      const res = await fetch(`/api/kalshi/markets?${params}`);
      if (!res.ok) throw new Error("Failed to fetch markets");
      const data = await res.json();
      setMarkets(data.markets || []);
      setCursor(data.cursor || undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  const handleNext = () => {
    if (cursor) {
      setPrevCursors((prev) => [...prev, cursor]);
      fetchMarkets(cursor);
    }
  };

  const handlePrev = () => {
    const prev = [...prevCursors];
    prev.pop();
    const prevCursor = prev[prev.length - 1];
    setPrevCursors(prev);
    fetchMarkets(prevCursor);
  };

  const filtered = search
    ? markets.filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          m.ticker.toLowerCase().includes(search.toLowerCase())
      )
    : markets;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Markets</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse all active Kalshi prediction markets
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search markets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">
          Loading markets...
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[350px]">Market</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>24h Change</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Open Interest</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((market) => {
                  const lastPrice = toNum(market.last_price);
                  const prevPrice = toNum(market.previous_price) || lastPrice;
                  const changePct =
                    prevPrice > 0
                      ? ((lastPrice - prevPrice) / prevPrice) * 100
                      : 0;
                  const changeColor =
                    changePct > 0
                      ? "text-green-500"
                      : changePct < 0
                        ? "text-red-500"
                        : "text-muted-foreground";

                  const vol = toNum(market.volume_24h) || toNum(market.volume_24h_fp) || toNum(market.volume);
                  const oi = toNum(market.open_interest) || toNum(market.open_interest_fp);

                  return (
                    <TableRow
                      key={market.ticker}
                      className="cursor-pointer hover:bg-accent/50"
                    >
                      <TableCell>
                        <Link href={`/market/${market.ticker}`} className="block">
                          <p className="font-medium text-sm line-clamp-1">
                            {market.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {market.ticker}
                          </p>
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono">
                        {lastPrice}&cent;
                      </TableCell>
                      <TableCell className={`font-mono ${changeColor}`}>
                        {formatPercent(changePct)}
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatNumber(vol)}
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatNumber(oi)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {market.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No markets found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filtered.length} markets
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={prevCursors.length === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={!cursor}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
