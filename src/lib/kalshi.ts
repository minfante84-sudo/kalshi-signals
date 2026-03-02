import crypto from "crypto";

const BASE_URL = "https://api.elections.kalshi.com/trade-api/v2";

// --- Types ---
// Note: Kalshi API returns most numeric fields as strings. We parse them in normalizeMarket().

export interface KalshiMarket {
  ticker: string;
  event_ticker: string;
  title: string;
  yes_sub_title: string;
  no_sub_title: string;
  market_type: string;
  status: string;
  result: string;
  yes_bid: number;
  yes_ask: number;
  no_bid: number;
  no_ask: number;
  yes_bid_dollars: number;
  yes_ask_dollars: number;
  no_bid_dollars: number;
  no_ask_dollars: number;
  last_price: number;
  last_price_dollars: number;
  previous_price: number;
  previous_price_dollars: number;
  volume: number;
  volume_24h: number;
  open_interest: number;
  open_interest_fp: number;
  notional_value_dollars: number;
  close_time: string;
  open_time: string;
  created_time: string;
  expected_expiration_time: string;
  strike_type: string;
}

// Raw market from API (all numeric fields are strings)
interface RawKalshiMarket {
  [key: string]: unknown;
}

function toNum(val: unknown): number {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

function normalizeMarket(raw: RawKalshiMarket): KalshiMarket {
  return {
    ticker: String(raw.ticker ?? ""),
    event_ticker: String(raw.event_ticker ?? ""),
    title: String(raw.title ?? ""),
    yes_sub_title: String(raw.yes_sub_title ?? ""),
    no_sub_title: String(raw.no_sub_title ?? ""),
    market_type: String(raw.market_type ?? "binary"),
    status: String(raw.status ?? ""),
    result: String(raw.result ?? ""),
    yes_bid: toNum(raw.yes_bid),
    yes_ask: toNum(raw.yes_ask),
    no_bid: toNum(raw.no_bid),
    no_ask: toNum(raw.no_ask),
    yes_bid_dollars: toNum(raw.yes_bid_dollars),
    yes_ask_dollars: toNum(raw.yes_ask_dollars),
    no_bid_dollars: toNum(raw.no_bid_dollars),
    no_ask_dollars: toNum(raw.no_ask_dollars),
    last_price: toNum(raw.last_price),
    last_price_dollars: toNum(raw.last_price_dollars),
    previous_price: toNum(raw.previous_price),
    previous_price_dollars: toNum(raw.previous_price_dollars),
    volume: toNum(raw.volume ?? raw.volume_fp),
    volume_24h: toNum(raw.volume_24h ?? raw.volume_24h_fp ?? 0),
    open_interest: toNum(raw.open_interest),
    open_interest_fp: toNum(raw.open_interest_fp),
    notional_value_dollars: toNum(raw.notional_value_dollars),
    close_time: String(raw.close_time ?? ""),
    open_time: String(raw.open_time ?? ""),
    created_time: String(raw.created_time ?? ""),
    expected_expiration_time: String(raw.expected_expiration_time ?? ""),
    strike_type: String(raw.strike_type ?? ""),
  };
}

export interface KalshiCandlestick {
  ticker: string;
  period: number;
  open_time: string;
  end_period_time: string;
  price: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
  volume: number;
  open_interest: number;
}

export interface KalshiOrderbook {
  ticker: string;
  yes: [number, number][]; // [price_cents, quantity]
  no: [number, number][];
}

export interface KalshiTrade {
  trade_id: string;
  ticker: string;
  count: number;
  yes_price: number;
  no_price: number;
  created_time: string;
  taker_side: string;
}

// --- API Functions ---

function signRequest(method: string, path: string, timestamp: number): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const apiKey = process.env.KALSHI_API_KEY;
  const privateKeyPem = process.env.KALSHI_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!apiKey || !privateKeyPem) return headers;

  const message = `${timestamp}${method}/trade-api/v2${path}`;
  const signature = crypto.sign("sha256", Buffer.from(message), {
    key: privateKeyPem,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
  });

  headers["KALSHI-ACCESS-KEY"] = apiKey;
  headers["KALSHI-ACCESS-TIMESTAMP"] = String(timestamp);
  headers["KALSHI-ACCESS-SIGNATURE"] = signature.toString("base64");
  return headers;
}

async function kalshiFetch<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
  revalidate = 30
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }

  const timestamp = Date.now();
  const headers = signRequest("GET", path, timestamp);

  const res = await fetch(url.toString(), {
    next: { revalidate },
    headers,
  });

  if (!res.ok) {
    throw new Error(`Kalshi API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getMarkets(params?: {
  limit?: number;
  cursor?: string;
  status?: string;
  series_ticker?: string;
  event_ticker?: string;
}): Promise<{ markets: KalshiMarket[]; cursor: string }> {
  const raw = await kalshiFetch<{ markets: RawKalshiMarket[]; cursor: string }>("/markets", {
    limit: params?.limit ?? 200,
    cursor: params?.cursor,
    status: params?.status,
    series_ticker: params?.series_ticker,
    event_ticker: params?.event_ticker,
  });
  return {
    markets: (raw.markets || []).map(normalizeMarket),
    cursor: raw.cursor,
  };
}

export async function getAllMarkets(params?: {
  status?: string;
}): Promise<KalshiMarket[]> {
  const allMarkets: KalshiMarket[] = [];
  let cursor: string | undefined;

  do {
    const result = await getMarkets({
      limit: 200,
      cursor,
      status: params?.status,
    });
    allMarkets.push(...result.markets);
    cursor = result.cursor || undefined;
  } while (cursor);

  return allMarkets;
}

export async function getMarket(ticker: string): Promise<{ market: KalshiMarket }> {
  const raw = await kalshiFetch<{ market: RawKalshiMarket }>(`/markets/${ticker}`);
  return { market: normalizeMarket(raw.market) };
}

export async function getOrderbook(ticker: string): Promise<{ orderbook: KalshiOrderbook }> {
  return kalshiFetch(`/markets/${ticker}/orderbook`, undefined, 10);
}

export async function getTrades(params?: {
  ticker?: string;
  limit?: number;
  cursor?: string;
}): Promise<{ trades: KalshiTrade[]; cursor: string }> {
  return kalshiFetch("/trades", {
    ticker: params?.ticker,
    limit: params?.limit ?? 50,
    cursor: params?.cursor,
  });
}

// Client-side fetcher for SWR
export async function clientFetch<T>(path: string): Promise<T> {
  const res = await fetch(`/api/kalshi${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
