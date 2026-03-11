"use client";

import { useEffect, useRef } from "react";

export function MobileAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeLoaded = useRef(false);

  useEffect(() => {
    if (!containerRef.current || iframeLoaded.current) return;
    iframeLoaded.current = true;

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.highperformanceformat.com/watchnew?key=fc44b092dbf032c9495ba9db4aff2cdc`;
    iframe.width = "320";
    iframe.height = "50";
    iframe.frameBorder = "0";
    iframe.scrolling = "no";
    iframe.style.border = "none";
    containerRef.current.appendChild(iframe);

    const interval = setInterval(() => {
      iframe.src = iframe.src;
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex justify-center md:hidden bg-black"
      style={{ width: "100%", height: 50 }}
    />
  );
}
