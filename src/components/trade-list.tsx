"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KalshiTrade } from "@/lib/kalshi";

export function TradeList({ trades }: { trades: KalshiTrade[] }) {
  if (trades.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No recent trades
      </p>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Side</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Contracts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade.trade_id}>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(trade.created_time).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell>
                <span
                  className={
                    trade.taker_side === "yes"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {trade.taker_side.toUpperCase()}
                </span>
              </TableCell>
              <TableCell className="font-mono">
                {(trade.yes_price * 100).toFixed(0)}&cent;
              </TableCell>
              <TableCell className="font-mono">{trade.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
