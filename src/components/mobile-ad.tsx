"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const AD_URLS: Record<string, string> = {
  "/popular":
    "//conventionalresponse.com/bKXDVis.dQGBlW0aYWWgcn/iepmS9Xu/ZVUZlCkdP-TxYi4pNLT/QNyWNmDYU/tONVjrgc1cNgD/IK0HOYQK",
};

const DEFAULT_AD_URL =
  "//conventionalresponse.com/b.XVVXs-dCGYlU0iYTW/cA/De/mI9/uTZjU/lbkLPoTIYM4sNITMMYx_N/jgE/t-Nyjmgf1LM/zVEJ2/NuQD";

export function MobileAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    const adUrl = AD_URLS[pathname] || DEFAULT_AD_URL;

    const script = document.createElement("script");
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";
    script.src = adUrl;
    containerRef.current.appendChild(script);
  }, [pathname]);

  return (
    <div
      className="flex justify-center md:hidden bg-black"
      style={{ minHeight: 100 }}
      ref={containerRef}
    />
  );
}
