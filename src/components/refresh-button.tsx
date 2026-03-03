"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

export function RefreshButton() {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);

  const handleRefresh = () => {
    setSpinning(true);
    router.refresh();
    setTimeout(() => setSpinning(false), 1500);
  };

  return (
    <button
      onClick={handleRefresh}
      className="inline-flex items-center gap-1.5 rounded-md bg-green-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-green-700 transition-colors"
    >
      <RefreshCw className={`h-3.5 w-3.5 ${spinning ? "animate-spin" : ""}`} />
      Refresh
    </button>
  );
}
