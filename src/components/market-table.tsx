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
import { Badge } from "@/components/ui/badge";
import { MarketSignal, formatDollars, formatPercent } from "@/lib/signals";
import { ArrowUpDown } from "lucide-react";

type SortKey = "signalScore" | "priceChangePct" | "volume24h" | "openInterest";

export function MarketTable({ signals }: { signals: MarketSignal[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("signalScore");
  const [sortDesc, setSortDesc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  const sorted = [...signals].sort((a, b) => {
    const mul = sortDesc ? -1 : 1;
    return (a[sortKey] - b[sortKey]) * mul;
  });

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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Market</TableHead>
            <TableHead>Price</TableHead>
            <SortableHeader label="24h Change" field="priceChangePct" />
            <SortableHeader label="Volume 24h" field="volume24h" />
            <SortableHeader label="Open Interest" field="openInterest" />
            <SortableHeader label="Signal" field="signalScore" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((signal) => {
            const { market, priceChangePct, signalStrength, signalType } = signal;
            const priceChangeColor =
              priceChangePct > 0
                ? "text-green-500"
                : priceChangePct < 0
                  ? "text-red-500"
                  : "text-muted-foreground";

            const strengthColor =
              signalStrength === "strong"
                ? "bg-chart-1 text-white"
                : signalStrength === "moderate"
                  ? "bg-chart-4 text-black"
                  : "bg-muted text-muted-foreground";

            return (
              <TableRow key={market.ticker} className="cursor-pointer hover:bg-accent/50">
                <TableCell>
                  <Link href={`/market/${market.ticker}`} className="block">
                    <p className="font-medium text-sm line-clamp-1">{market.title}</p>
                    <p className="text-xs text-muted-foreground">{market.ticker}</p>
                  </Link>
                </TableCell>
                <TableCell className="font-mono">
                  {(market.last_price_dollars * 100).toFixed(0)}&cent;
                </TableCell>
                <TableCell className={`font-mono ${priceChangeColor}`}>
                  {formatPercent(priceChangePct)}
                </TableCell>
                <TableCell className="font-mono">
                  {formatDollars(signal.volume24h)}
                </TableCell>
                <TableCell className="font-mono">
                  {formatDollars(signal.openInterest)}
                </TableCell>
                <TableCell>
                  <Badge className={strengthColor} variant="secondary">
                    {signal.signalScore}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
