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
import { MarketMover, formatNumber, formatPercent } from "@/lib/signals";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, X } from "lucide-react";

function formatTitle(title: string): string {
  return title
    .split(",")
    .map((leg) => leg.trim().replace(/^(yes|no)\s+/i, ""))
    .join(" + ");
}

type SortKey = "absPriceChange" | "priceChangePct" | "volume24h" | "lastPrice";
const PAGE_SIZE = 20;

export function MomentumTable({ movers }: { movers: MarketMover[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("absPriceChange");
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
    ? movers.filter((m) => {
        const q = search.toLowerCase();
        return (
          m.market.title.toLowerCase().includes(q) ||
          m.market.ticker.toLowerCase().includes(q) ||
          m.market.event_ticker.toLowerCase().includes(q)
        );
      })
    : movers;

  const sorted = [...filtered].sort((a, b) => {
    const mul = sortDesc ? -1 : 1;
    const valA = sortKey === "lastPrice" ? a.market.last_price : sortKey === "priceChangePct" ? Math.abs(a.priceChangePct) : a[sortKey];
    const valB = sortKey === "lastPrice" ? b.market.last_price : sortKey === "priceChangePct" ? Math.abs(b.priceChangePct) : b[sortKey];
    return (valA - valB) * mul;
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const changeColor = (val: number) =>
    val > 0 ? "text-green-500" : val < 0 ? "text-red-500" : "text-muted-foreground";

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
        {paged.map((mover) => {
          const { market } = mover;
          return (
            <Link
              key={market.ticker}
              href={`/market/${market.ticker}?from=trending`}
              className="block rounded-lg border p-4 hover:bg-accent/50 active:bg-accent/70 transition-colors"
            >
              <p className="font-medium text-sm leading-snug">{formatTitle(market.title)}</p>
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <span className="font-mono font-semibold text-base">{market.last_price}&cent;</span>
                <span className={`font-mono font-semibold ${changeColor(mover.priceChange)}`}>
                  {mover.priceChange > 0 ? "+" : ""}{mover.priceChange}&cent;
                </span>
                <span className={`font-mono text-sm ${changeColor(mover.priceChange)}`}>
                  {formatPercent(mover.priceChangePct)}
                </span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Volume: <span className="font-mono">{formatNumber(mover.volume24h)}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Desktop table layout */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Market</TableHead>
              <SortableHeader label="Price" field="lastPrice" />
              <SortableHeader label="Change" field="absPriceChange" />
              <SortableHeader label="% Change" field="priceChangePct" />
              <SortableHeader label="Volume 24h" field="volume24h" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((mover) => {
              const { market } = mover;
              return (
                <TableRow key={market.ticker} className="cursor-pointer hover:bg-accent/50">
                  <TableCell className="max-w-[300px]">
                    <Link href={`/market/${market.ticker}?from=trending`} className="block">
                      <p className="font-medium text-sm truncate">{formatTitle(market.title)}</p>
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono">
                    {market.last_price}&cent;
                  </TableCell>
                  <TableCell className={`font-mono font-semibold ${changeColor(mover.priceChange)}`}>
                    {mover.priceChange > 0 ? "+" : ""}{mover.priceChange}&cent;
                  </TableCell>
                  <TableCell className={`font-mono ${changeColor(mover.priceChange)}`}>
                    {formatPercent(mover.priceChangePct)}
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatNumber(mover.volume24h)}
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
