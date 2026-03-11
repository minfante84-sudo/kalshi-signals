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
import type { MarketSpread } from "@/app/widest-spreads/page";
import { formatNumber } from "@/lib/signals";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, X } from "lucide-react";

function formatTitle(title: string): string {
  return title
    .split(",")
    .map((leg) => leg.trim().replace(/^(yes|no)\s+/i, ""))
    .join(" + ");
}

type SortKey = "spread" | "midPrice" | "volume24h";
const PAGE_SIZE = 20;

export function WidestSpreadsTable({ spreads }: { spreads: MarketSpread[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("spread");
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
    ? spreads.filter((s) => {
        const q = search.toLowerCase();
        return (
          s.market.title.toLowerCase().includes(q) ||
          s.market.ticker.toLowerCase().includes(q) ||
          s.market.event_ticker.toLowerCase().includes(q)
        );
      })
    : spreads;

  const sorted = [...filtered].sort((a, b) => {
    const mul = sortDesc ? -1 : 1;
    return (a[sortKey] - b[sortKey]) * mul;
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
        {paged.map((item) => {
          const { market } = item;
          return (
            <div key={market.ticker}>
              <Link
                href={`/market/${market.ticker}`}
                className="block rounded-lg border p-4 hover:bg-accent/50 active:bg-accent/70 transition-colors"
              >
                <p className="font-medium text-sm leading-snug">{formatTitle(market.title)}</p>
                <div className="mt-3 flex items-center gap-3 flex-wrap">
                  <span className="font-mono font-semibold text-base">{item.spread}&cent; spread</span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Bid: <span className="font-mono text-foreground">{market.yes_bid}&cent;</span></span>
                  <span>Ask: <span className="font-mono text-foreground">{market.yes_ask}&cent;</span></span>
                  <span>Vol: <span className="font-mono">{formatNumber(item.volume24h)}</span></span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Desktop table layout */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Market</TableHead>
              <SortableHeader label="Spread" field="spread" />
              <TableHead>Bid</TableHead>
              <TableHead>Ask</TableHead>
              <SortableHeader label="Mid Price" field="midPrice" />
              <SortableHeader label="Volume" field="volume24h" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((item) => {
              const { market } = item;
              return (
                <TableRow key={market.ticker} className="cursor-pointer hover:bg-accent/50">
                  <TableCell className="max-w-[300px]">
                    <Link href={`/market/${market.ticker}`} className="block">
                      <p className="font-medium text-sm truncate">{formatTitle(market.title)}</p>
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono font-semibold">
                    {item.spread}&cent;
                  </TableCell>
                  <TableCell className="font-mono">
                    {market.yes_bid}&cent;
                  </TableCell>
                  <TableCell className="font-mono">
                    {market.yes_ask}&cent;
                  </TableCell>
                  <TableCell className="font-mono">
                    {item.midPrice}&cent;
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatNumber(item.volume24h)}
                  </TableCell>
                </TableRow>
              );
            })}
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
