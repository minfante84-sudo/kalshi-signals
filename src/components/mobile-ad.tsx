"use client";

import { useEffect, useRef } from "react";

export function MobileAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    const script = document.createElement("script");
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";
    script.src =
      "//conventionalresponse.com/b.XVVXs-dCGYlU0iYTW/cA/De/mI9/uTZjU/lbkLPoTIYM4sNITMMYx_N/jgE/t-Nyjmgf1LM/zVEJ2/NuQD";
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      className="flex justify-center md:hidden bg-black"
      style={{ minHeight: 100 }}
      ref={containerRef}
    />
  );
}
