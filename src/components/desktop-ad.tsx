"use client";

import { useEffect, useRef } from "react";

export function DesktopAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeLoaded = useRef(false);

  useEffect(() => {
    if (!containerRef.current || iframeLoaded.current) return;
    iframeLoaded.current = true;

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.highperformanceformat.com/watchnew?key=9833218a541be5b4bc8c5d2a28bef9ca`;
    iframe.width = "728";
    iframe.height = "90";
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
      className="hidden md:flex justify-center bg-black"
      style={{ width: "100%", height: 90 }}
    />
  );
}
