import { kv } from "@vercel/kv";

export interface SnapshotEntry {
  ticker: string;
  event_ticker: string;
  title: string;
  last_price: number;
  previous_price: number;
  priceChange: number;
  priceChangePct: number;
  volume24h: number;
  openInterest: number;
  signalScore: number;
  signalType: "bullish" | "bearish" | "neutral";
  signalStrength: "strong" | "moderate" | "weak";
}

const DATES_KEY = "snapshot:dates";

function snapshotKey(date: string): string {
  return `snapshot:${date}`;
}

export async function saveSnapshot(
  date: string,
  entries: SnapshotEntry[]
): Promise<void> {
  await kv.set(snapshotKey(date), JSON.stringify(entries));
  await kv.zadd(DATES_KEY, { score: new Date(date).getTime(), member: date });
}

export async function getSnapshot(
  date: string
): Promise<SnapshotEntry[] | null> {
  const data = await kv.get<string>(snapshotKey(date));
  if (!data) return null;
  return typeof data === "string" ? JSON.parse(data) : data;
}

export async function getAvailableDates(): Promise<string[]> {
  const dates = await kv.zrange(DATES_KEY, 0, -1, { rev: true });
  return dates as string[];
}
