import { getAvailableDates, getSnapshot, SnapshotEntry } from "@/lib/snapshots";
import { formatDollars, formatNumber, formatPercent } from "@/lib/signals";
import { History } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function HistoricalPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  let dates: string[] = [];
  let entries: SnapshotEntry[] | null = null;
  let capturedAt: string | null = null;
  let selectedDate: string | null = null;
  let error: string | null = null;

  try {
    dates = await getAvailableDates();
    selectedDate = params.date || dates[0] || null;

    if (selectedDate) {
      const snapshot = await getSnapshot(selectedDate);
      if (snapshot) {
        entries = snapshot.entries;
        capturedAt = snapshot.capturedAt;
      }
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load historical data";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
          <History className="h-5 w-5 sm:h-6 sm:w-6 text-chart-1" />
          Historical Signals
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Daily snapshots of the top 50 largest single trades captured at end of
          each trading day.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {dates.length > 0 && (
        <div className="flex items-center gap-3">
          <label
            htmlFor="date-select"
            className="text-sm font-medium text-muted-foreground"
          >
            Date:
          </label>
          <DateSelector dates={dates} selected={selectedDate} />
        </div>
      )}

      {entries && entries.length > 0 && (
        <>
          {capturedAt && (
            <p className="text-xs text-muted-foreground">
              As of{" "}
              {new Date(capturedAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone: "America/New_York",
              })}{" "}
              ET
            </p>
          )}

          {/* Mobile card layout */}
          <div className="space-y-3 md:hidden">
            {entries.map((entry) => {
              const priceChangeColor =
                entry.priceChangePct > 0
                  ? "text-green-500"
                  : entry.priceChangePct < 0
                    ? "text-red-500"
                    : "text-muted-foreground";

              return (
                <Link
                  key={entry.ticker}
                  href={`/market/${entry.ticker}`}
                  className="block rounded-lg border p-4 hover:bg-accent/50 active:bg-accent/70 transition-colors"
                >
                  <p className="font-medium text-sm leading-snug">
                    {entry.title}
                  </p>
                  <div className="mt-3 flex items-center gap-3 flex-wrap">
                    <span className="font-mono font-semibold text-base">
                      {formatDollars(entry.largestTrade)}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${entry.largestTradeSide === "yes" ? "bg-green-500/15 text-green-600" : "bg-red-500/15 text-red-600"}`}
                    >
                      {entry.largestTradeSide === "yes" ? "Yes" : "No"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatNumber(entry.largestTradeContracts)} ct
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      Price:{" "}
                      <span className="font-mono text-foreground">
                        {entry.last_price}&cent;
                      </span>
                    </span>
                    <span className={`font-mono ${priceChangeColor}`}>
                      {formatPercent(entry.priceChangePct)}
                    </span>
                    <span>
                      Vol:{" "}
                      <span className="font-mono">
                        {formatNumber(entry.volume24h)}
                      </span>
                    </span>
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
                  <TableHead className="w-1/2">Market</TableHead>
                  <TableHead>Largest Trade</TableHead>
                  <TableHead>Wager</TableHead>
                  <TableHead>Volume 24h</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => {
                  const priceChangeColor =
                    entry.priceChangePct > 0
                      ? "text-green-500"
                      : entry.priceChangePct < 0
                        ? "text-red-500"
                        : "text-muted-foreground";

                  return (
                    <TableRow key={entry.ticker}>
                      <TableCell className="max-w-[300px]">
                        <Link
                          href={`/market/${entry.ticker}`}
                          className="block"
                        >
                          <p className="font-medium text-sm truncate">
                            {entry.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {entry.ticker}
                          </p>
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono font-semibold">
                        <span>{formatDollars(entry.largestTrade)}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({formatNumber(entry.largestTradeContracts)} ct)
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${entry.largestTradeSide === "yes" ? "bg-green-500/15 text-green-600" : "bg-red-500/15 text-red-600"}`}
                        >
                          {entry.largestTradeSide === "yes" ? "Yes" : "No"}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatNumber(entry.volume24h)}
                      </TableCell>
                      <TableCell className="font-mono">
                        {entry.last_price}&cent;
                      </TableCell>
                      <TableCell
                        className={`font-mono ${priceChangeColor}`}
                      >
                        {formatPercent(entry.priceChangePct)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {!error && dates.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No historical snapshots yet. Data will appear after the first daily
          snapshot runs.
        </div>
      )}

      {selectedDate && entries && entries.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No data found for {selectedDate}.
        </div>
      )}
    </div>
  );
}

function DateSelector({
  dates,
  selected,
}: {
  dates: string[];
  selected: string | null;
}) {
  return (
    <form>
      <select
        name="date"
        defaultValue={selected ?? ""}
        className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
      >
        {dates.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="ml-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-accent"
      >
        View
      </button>
    </form>
  );
}
