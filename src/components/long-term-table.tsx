"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KalshiMarket } from "@/lib/kalshi";
import { formatNumber } from "@/lib/signals";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, X } from "lucide-react";

function formatTitle(title: string): string {
  return title
    .split(",")
    .map((leg) => leg.trim().replace(/^(yes|no)\s+/i, ""))
    .join(" + ");
}

function timeUntil(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return "ended";
  const days = Math.floor(diff / 86400000);
  if (days >= 30) {
    const months = Math.floor(days / 30);
    return `${months}mo`;
  }
  return `${days}d`;
}

type SortKey = "volume" | "volume24h" | "lastPrice" | "closeTime";
const PAGE_SIZE = 20;

export function LongTermTable({ markets }: { markets: KalshiMarket[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("volume");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
    setPage(0);
  };

  const filtered = search
    ? markets.filter((m) => {
        const q = search.toLowerCase();
        return (
          m.title.toLowerCase().includes(q) ||
          m.ticker.toLowerCase().includes(q) ||
          m.event_ticker.toLowerCase().includes(q)
        );
      })
    : markets;

  const sorted = [...filtered].sort((a, b) => {
    const mul = sortDesc ? -1 : 1;
    if (sortKey === "volume") return (a.volume - b.volume) * mul;
    if (sortKey === "volume24h") return ((a.volume_24h || 0) - (b.volume_24h || 0)) * mul;
    if (sortKey === "closeTime") {
      return (new Date(a.close_time).getTime() - new Date(b.close_time).getTime()) * mul;
    }
    return (a.last_price - b.last_price) * mul;
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const SortableHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <TableHead
      className="cursor-pointer select-none hover:text-foreground"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3" />
      </span>
    </TableHead>
  );

  return (
    <>
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search markets..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="h-9 w-full rounded-md border border-input bg-transparent px-9 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {search && (
          <button
            onClick={() => { setSearch(""); setPage(0); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Mobile card layout */}
      <div className="space-y-3 md:hidden">
        {paged.map((market) => (
          <div key={market.ticker}>
            <Link
              href={`/market/${market.ticker}`}
              className="block rounded-lg border p-4 hover:bg-accent/50 active:bg-accent/70 transition-colors"
            >
              <p className="font-medium text-sm leading-snug">{formatTitle(market.title)}</p>
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <span className="text-xs text-muted-foreground">
                  Ends in {timeUntil(market.close_time)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Price: <span className="font-mono text-foreground">{market.last_price}&cent;</span>
                </span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span>Vol: <span className="font-mono">{formatNumber(market.volume)}</span></span>
                <span>24h: <span className="font-mono">{formatNumber(market.volume_24h)}</span></span>
                <span>Bid: <span className="font-mono">{market.yes_bid}&cent;</span></span>
                <span>Ask: <span className="font-mono">{market.yes_ask}&cent;</span></span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Desktop table layout */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Market</TableHead>
              <SortableHeader label="Ends In" field="closeTime" />
              <SortableHeader label="Price" field="lastPrice" />
              <TableHead>Bid / Ask</TableHead>
              <SortableHeader label="Volume" field="volume" />
              <SortableHeader label="24h Vol" field="volume24h" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((market) => (
              <TableRow key={market.ticker} className="cursor-pointer hover:bg-accent/50">
                <TableCell className="max-w-[300px]">
                  <Link href={`/market/${market.ticker}`} className="block">
                    <p className="font-medium text-sm truncate">{formatTitle(market.title)}</p>
                  </Link>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {timeUntil(market.close_time)}
                </TableCell>
                <TableCell className="font-mono">
                  {market.last_price}&cent;
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {market.yes_bid}&cent; / {market.yes_ask}&cent;
                </TableCell>
                <TableCell className="font-mono">
                  {formatNumber(market.volume)}
                </TableCell>
                <TableCell className="font-mono">
                  {formatNumber(market.volume_24h)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}
