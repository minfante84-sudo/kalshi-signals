"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { KalshiCandlestick } from "@/lib/kalshi";

interface PriceChartProps {
  candlesticks: KalshiCandlestick[];
}

export function PriceChart({ candlesticks }: PriceChartProps) {
  const data = candlesticks.map((c) => ({
    time: new Date(c.open_time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    price: c.price.close * 100, // convert to cents
    high: c.price.high * 100,
    low: c.price.low * 100,
    volume: c.volume,
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No price data available
      </div>
    );
  }

  const minPrice = Math.floor(Math.min(...data.map((d) => d.low)) - 2);
  const maxPrice = Math.ceil(Math.max(...data.map((d) => d.high)) + 2);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 11, fill: "hsl(0, 0%, 60%)" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[minPrice, maxPrice]}
          tick={{ fontSize: 11, fill: "hsl(0, 0%, 60%)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}\u00A2`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(0, 0%, 12%)",
            border: "1px solid hsl(0, 0%, 20%)",
            borderRadius: "8px",
            fontSize: 12,
          }}
          labelStyle={{ color: "hsl(0, 0%, 70%)" }}
          formatter={(value?: number) => [`${(value ?? 0).toFixed(1)}\u00A2`, "Price"]}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke="hsl(217, 91%, 60%)"
          strokeWidth={2}
          fill="url(#priceGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
