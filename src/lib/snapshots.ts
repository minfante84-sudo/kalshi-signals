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
  try {
    const dates = await kv.zrange(DATES_KEY, 0, -1);
    return (dates as string[]).reverse();
  } catch {
    return [];
  }
}
