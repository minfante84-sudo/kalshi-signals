"use client";

import { useEffect, useRef } from "react";

export function InlineAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeLoaded = useRef(false);

  useEffect(() => {
    if (!containerRef.current || iframeLoaded.current) return;
    iframeLoaded.current = true;

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.highperformanceformat.com/watchnew?key=600c9dfc1de05f87b389e7897fea5a45`;
    iframe.width = "300";
    iframe.height = "250";
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
    <div className="flex justify-center">
      <div
        ref={containerRef}
        style={{ width: 300, height: 250 }}
      />
    </div>
  );
}
