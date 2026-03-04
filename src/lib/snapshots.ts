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
  const capturedAt = new Date().toISOString();
  await kv.set(snapshotKey(date), entries);
  await kv.set(`${snapshotKey(date)}:time`, capturedAt);
  await kv.zadd(DATES_KEY, { score: new Date(date).getTime(), member: date });
}

export async function getSnapshot(
  date: string
): Promise<{ entries: SnapshotEntry[]; capturedAt: string | null } | null> {
  try {
    const raw = await kv.get(snapshotKey(date));
    if (!raw) return null;

    // Parse entries — could be a JSON string or already-parsed array/object
    let parsed: unknown = raw;
    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }

    let entries: SnapshotEntry[];
    if (Array.isArray(parsed)) {
      entries = parsed;
    } else if (parsed && typeof parsed === "object" && "entries" in parsed) {
      entries = (parsed as Snapshot).entries || [];
    } else {
      return null;
    }

    // Filter out entries from old schema that lack required fields
    entries = entries.filter(
      (e: SnapshotEntry) =>
        typeof e.largestTrade === "number" && !isNaN(e.largestTrade)
    );

    // Read timestamp from separate key
    const capturedAt =
      (await kv.get<string>(`${snapshotKey(date)}:time`)) || null;

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
