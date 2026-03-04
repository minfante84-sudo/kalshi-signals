"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";

const AUTO_REFRESH_INTERVAL = 30_000; // 30 seconds

export function RefreshButton() {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(AUTO_REFRESH_INTERVAL / 1000);

  const doRefresh = useCallback(() => {
    setSpinning(true);
    router.refresh();
    setSecondsLeft(AUTO_REFRESH_INTERVAL / 1000);
    setTimeout(() => setSpinning(false), 1500);
  }, [router]);

  // Auto-refresh countdown
  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          doRefresh();
          return AUTO_REFRESH_INTERVAL / 1000;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [doRefresh]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground tabular-nums">
        {secondsLeft}s
      </span>
      <button
        onClick={doRefresh}
        className="inline-flex items-center gap-1.5 rounded-md bg-green-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-green-700 transition-colors"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${spinning ? "animate-spin" : ""}`} />
        Refresh
      </button>
    </div>
  );
}
