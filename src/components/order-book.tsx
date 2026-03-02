"use client";

import { KalshiOrderbook } from "@/lib/kalshi";

export function OrderBook({ orderbook }: { orderbook: KalshiOrderbook }) {
  const yesBids = [...(orderbook.yes || [])].sort((a, b) => b[0] - a[0]).slice(0, 10);
  const noBids = [...(orderbook.no || [])].sort((a, b) => b[0] - a[0]).slice(0, 10);

  const maxQty = Math.max(
    ...yesBids.map((b) => b[1]),
    ...noBids.map((b) => b[1]),
    1
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="mb-2 text-sm font-medium text-green-500">Yes Bids</h4>
        <div className="space-y-1">
          {yesBids.length === 0 && (
            <p className="text-xs text-muted-foreground">No bids</p>
          )}
          {yesBids.map(([price, qty], i) => (
            <div key={i} className="relative flex items-center justify-between rounded px-2 py-1 text-xs">
              <div
                className="absolute inset-y-0 left-0 rounded bg-green-500/10"
                style={{ width: `${(qty / maxQty) * 100}%` }}
              />
              <span className="relative font-mono">{price}&cent;</span>
              <span className="relative font-mono text-muted-foreground">{qty}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium text-red-500">No Bids</h4>
        <div className="space-y-1">
          {noBids.length === 0 && (
            <p className="text-xs text-muted-foreground">No bids</p>
          )}
          {noBids.map(([price, qty], i) => (
            <div key={i} className="relative flex items-center justify-between rounded px-2 py-1 text-xs">
              <div
                className="absolute inset-y-0 right-0 rounded bg-red-500/10"
                style={{ width: `${(qty / maxQty) * 100}%` }}
              />
              <span className="relative font-mono">{price}&cent;</span>
              <span className="relative font-mono text-muted-foreground">{qty}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
