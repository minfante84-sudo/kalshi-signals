import { getAvailableDates, getSnapshot, SnapshotEntry } from "@/lib/snapshots";
import { formatNumber, formatPercent } from "@/lib/signals";
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
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function HistoricalPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  let dates: string[] = [];
  let entries: SnapshotEntry[] | null = null;
  let selectedDate: string | null = null;
  let error: string | null = null;

  try {
    dates = await getAvailableDates();
    selectedDate = params.date || dates[0] || null;

    if (selectedDate) {
      entries = await getSnapshot(selectedDate);
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load historical data";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <History className="h-6 w-6 text-chart-1" />
          Historical Signals
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Daily snapshots of the top 50 market signals captured at end of each
          trading day.
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Market</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>24h Change</TableHead>
                <TableHead>Volume 24h</TableHead>
                <TableHead>Open Interest</TableHead>
                <TableHead>Signal</TableHead>
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

                const strengthColor =
                  entry.signalStrength === "strong"
                    ? "bg-chart-1 text-white"
                    : entry.signalStrength === "moderate"
                      ? "bg-chart-4 text-black"
                      : "bg-muted text-muted-foreground";

                return (
                  <TableRow key={entry.ticker}>
                    <TableCell>
                      <Link
                        href={`/market/${entry.ticker}`}
                        className="block"
                      >
                        <p className="font-medium text-sm line-clamp-1">
                          {entry.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.ticker}
                        </p>
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono">
                      {entry.last_price}&cent;
                    </TableCell>
                    <TableCell className={`font-mono ${priceChangeColor}`}>
                      {formatPercent(entry.priceChangePct)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatNumber(entry.volume24h)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatNumber(entry.openInterest)}
                    </TableCell>
                    <TableCell>
                      <Badge className={strengthColor} variant="secondary">
                        {entry.signalScore}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
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
        // Use JS-free form submission: selecting triggers navigation via noscript-friendly pattern
        // We'll use a submit button for accessibility
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
