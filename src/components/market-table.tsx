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
import { MarketSignal, formatDollars, formatNumber, formatPercent } from "@/lib/signals";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, X } from "lucide-react";


function formatTitle(title: string): string {
  // Strip "yes "/"no " prefixes from each leg and join with " + "
  return title
    .split(",")
    .map((leg) => leg.trim().replace(/^(yes|no)\s+/i, ""))
    .join(" + ");
}

const CATEGORY_MAP: [RegExp, string][] = [
  [/KXNBAGAME|KXNBASPREAD|KXNBAPOINTS/, "NBA"],
  [/KXNCAAMB/, "College Basketball"],
  [/KXNFLGAME|KXNFLSPREAD/, "NFL"],
  [/KXEPLGAME|KXEPL/, "Soccer — EPL"],
  [/KXLALIGA/, "Soccer — La Liga"],
  [/KXSERIEA/, "Soccer — Serie A"],
  [/KXNHLGAME|KXNHL/, "NHL"],
  [/KXMLBGAME|KXMLB/, "MLB"],
  [/KXBTC/, "Bitcoin"],
  [/KXETH/, "Ethereum"],
  [/KXSOL/, "Solana"],
  [/KXXRP/, "XRP"],
  [/KXDOGE/, "Dogecoin"],
  [/KXMVECROSSCATEGORY/, "Multi-Category Parlay"],
  [/KXMVESPORTSMULTIGAME/, "Sports Parlay"],
  [/KXALIENS/, "Politics / Events"],
  [/KXATPCHALLENGER|KXATP/, "Tennis — ATP"],
  [/KXWTA/, "Tennis — WTA"],
  [/KXMARMAD/, "March Madness"],
];

function getCategory(eventTicker: string): string {
  for (const [re, label] of CATEGORY_MAP) {
    if (re.test(eventTicker)) return label;
  }
  return "";
}

function getDescription(market: { event_ticker: string; subtitle: string; rules_primary: string; yes_sub_title: string; title: string }): string {
  // Use first sentence of rules_primary when available
  if (market.rules_primary) {
    const first = market.rules_primary.split(/\.\s/)[0];
    return first.length > 120 ? first.slice(0, 117) + "..." : first;
  }
  // Use subtitle if available and different from title
  if (market.subtitle && market.subtitle !== market.title) return market.subtitle;
  // Fall back to category inferred from event ticker
  const cat = getCategory(market.event_ticker);
  if (cat) return cat;
  return "";
}

type SortKey = "largestTrade" | "volume24h" | "priceChangePct";
const PAGE_SIZE = 20;

export function MarketTable({ signals }: { signals: MarketSignal[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("largestTrade");
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
    ? signals.filter((s) => {
        const q = search.toLowerCase();
        return (
          s.market.title.toLowerCase().includes(q) ||
          s.market.ticker.toLowerCase().includes(q) ||
          s.market.event_ticker.toLowerCase().includes(q) ||
          getCategory(s.market.event_ticker).toLowerCase().includes(q)
        );
      })
    : signals;

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
        {paged.map((signal, index) => {
          const { market, priceChangePct } = signal;
          const priceChangeColor =
            priceChangePct > 0
              ? "text-green-500"
              : priceChangePct < 0
                ? "text-red-500"
                : "text-muted-foreground";

          return (
            <div key={market.ticker}>
              <Link
                href={`/market/${market.ticker}`}
                className="block rounded-lg border p-4 hover:bg-accent/50 active:bg-accent/70 transition-colors"
              >
                <p className="font-medium text-sm leading-snug">{formatTitle(market.title)}</p>
                {(() => {
                  const desc = getDescription(market);
                  return desc ? (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{desc}</p>
                  ) : null;
                })()}
                <div className="mt-3 flex items-center gap-3 flex-wrap">
                  <span className="font-mono font-semibold text-base">{formatDollars(signal.largestTrade)}</span>
                  <span className={`text-xs font-semibold ${signal.largestTradeSide === "yes" ? "text-green-600" : "text-red-600"}`}>
                    {signal.largestTradeSide === "yes" ? "Yes" : "No"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatNumber(signal.largestTradeContracts)} ct
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Price: <span className="font-mono text-foreground">{market.last_price}&cent;</span></span>
                  <span className={`font-mono ${priceChangeColor}`}>{formatPercent(priceChangePct)}</span>
                  <span>Vol: <span className="font-mono">{formatNumber(signal.volume24h)}</span></span>
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
              <SortableHeader label="Largest Trade" field="largestTrade" />
              <TableHead>Wager</TableHead>
              <SortableHeader label="Volume 24h" field="volume24h" />
              <TableHead>Price</TableHead>
              <SortableHeader label="Change" field="priceChangePct" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((signal) => {
              const { market, priceChangePct } = signal;
              const priceChangeColor =
                priceChangePct > 0
                  ? "text-green-500"
                  : priceChangePct < 0
                    ? "text-red-500"
                    : "text-muted-foreground";

              return (
                <TableRow key={market.ticker} className="cursor-pointer hover:bg-accent/50">
                  <TableCell className="max-w-[300px]">
                    <Link href={`/market/${market.ticker}`} className="block">
                      <p className="font-medium text-sm truncate">{formatTitle(market.title)}</p>
                      {(() => {
                        const desc = getDescription(market);
                        return desc ? (
                          <p className="text-xs text-muted-foreground truncate">{desc}</p>
                        ) : null;
                      })()}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono font-semibold">
                    <span>{formatDollars(signal.largestTrade)}</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({formatNumber(signal.largestTradeContracts)} ct)
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold ${signal.largestTradeSide === "yes" ? "text-green-600" : "text-red-600"}`}>
                      {signal.largestTradeSide === "yes" ? "Yes" : "No"}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatNumber(signal.volume24h)}
                  </TableCell>
                  <TableCell className="font-mono">
                    {market.last_price}&cent;
                  </TableCell>
                  <TableCell className={`font-mono ${priceChangeColor}`}>
                    {formatPercent(priceChangePct)}
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
