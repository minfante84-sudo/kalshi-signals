const BASE_URL = "https://api.elections.kalshi.com/trade-api/v2";

// --- Types ---

export interface KalshiMarket {
  ticker: string;
  event_ticker: string;
  title: string;
  yes_sub_title: string;
  no_sub_title: string;
  market_type: "binary" | "scalar";
  status: string;
  result: string;
  yes_bid_dollars: number;
  yes_ask_dollars: number;
  no_bid_dollars: number;
  no_ask_dollars: number;
  last_price_dollars: number;
  previous_price_dollars: number;
  previous_yes_bid_dollars: number;
  previous_yes_ask_dollars: number;
  volume_fp: number;
  volume_24h_fp: number;
  open_interest_fp: number;
  notional_value_dollars: number;
  close_time: string;
  open_time: string;
  created_time: string;
  expected_expiration_time: string;
  settlement_ts: string;
  strike_type: string;
  floor_strike: number;
  cap_strike: number;
  functional_strike: string;
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

// --- API Functions ---

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

  const res = await fetch(url.toString(), {
    next: { revalidate },
    headers: { Accept: "application/json" },
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
  return kalshiFetch("/markets", {
    limit: params?.limit ?? 200,
    cursor: params?.cursor,
    status: params?.status ?? "open",
    series_ticker: params?.series_ticker,
    event_ticker: params?.event_ticker,
  });
}

export async function getMarket(ticker: string): Promise<{ market: KalshiMarket }> {
  return kalshiFetch(`/markets/${ticker}`);
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

export async function getCandlesticks(
  seriesTicker: string,
  ticker: string,
  params?: {
    period?: number; // 1, 60, 1440
    start_ts?: number;
    end_ts?: number;
  }
): Promise<{ candlesticks: KalshiCandlestick[] }> {
  return kalshiFetch(
    `/series/${seriesTicker}/markets/${ticker}/candlesticks`,
    {
      period_interval: params?.period ?? 60,
      start_ts: params?.start_ts,
      end_ts: params?.end_ts,
    },
    60
  );
}

// Client-side fetcher for SWR
export async function clientFetch<T>(path: string): Promise<T> {
  const res = await fetch(`/api/kalshi${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
