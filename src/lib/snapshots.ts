import { kv } from "@vercel/kv";

export interface SnapshotEntry {
  ticker: string;
  event_ticker: string;
  title: string;
  last_price: number;
  previous_price: number;
  largestTrade: number;
  largestTradeContracts: number;
  largestTradeSide: "yes" | "no";
  priceChange: number;
  priceChangePct: number;
  volume24h: number;
  openInterest: number;
  signalStrength: "high" | "moderate" | "low";
}

const DATES_KEY = "snapshot:dates";

function snapshotKey(date: string): string {
  return `snapshot:${date}`;
}

export interface Snapshot {
  entries: SnapshotEntry[];
  capturedAt: string; // ISO timestamp
}

export async function saveSnapshot(
  date: string,
  entries: SnapshotEntry[]
): Promise<void> {
  const snapshot: Snapshot = {
    entries,
    capturedAt: new Date().toISOString(),
  };
  await kv.set(snapshotKey(date), snapshot);
  await kv.zadd(DATES_KEY, { score: new Date(date).getTime(), member: date });
}

export async function getSnapshot(
  date: string
): Promise<{ entries: SnapshotEntry[]; capturedAt: string | null } | null> {
  try {
    const data = await kv.get<string>(snapshotKey(date));
    if (!data) return null;
    const parsed = typeof data === "string" ? JSON.parse(data) : data;

    // Handle both old format (bare array) and new format ({ entries, capturedAt })
    let entries: SnapshotEntry[];
    let capturedAt: string | null = null;
    if (Array.isArray(parsed)) {
      entries = parsed;
    } else {
      entries = parsed.entries || [];
      capturedAt = parsed.capturedAt || null;
    }

    // Filter out entries from old schema that lack required fields
    entries = entries.filter(
      (e: SnapshotEntry) =>
        typeof e.largestTrade === "number" && !isNaN(e.largestTrade)
    );

    return { entries, capturedAt };
  } catch {
    return null;
  }
}

export async function getAvailableDates(): Promise<string[]> {
  try {
    const dates = await kv.zrange(DATES_KEY, 0, -1);
    return (dates as string[]).reverse();
  } catch {
    return [];
  }
}
