"use client";

import { useEffect, useRef } from "react";

export function MobileAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    function loadAd() {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";
      const script = document.createElement("script");
      script.async = true;
      script.referrerPolicy = "no-referrer-when-downgrade";
      script.src =
        "//conventionalresponse.com/b.XVVXs-dCGYlU0iYTW/cA/De/mI9/uTZjU/lbkLPoTIYM4sNITMMYx_N/jgE/t-Nyjmgf1LM/zVEJ2/NuQD";
      containerRef.current.appendChild(script);
    }

    loadAd();
    const interval = setInterval(loadAd, 35000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex justify-center md:hidden bg-black"
      style={{ minHeight: 100 }}
      ref={containerRef}
    />
  );
}
