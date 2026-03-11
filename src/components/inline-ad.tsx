"use client";

import { useEffect, useRef, useCallback } from "react";

export function InlineAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  const loadAd = useCallback(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const optionsScript = document.createElement("script");
    optionsScript.text = `
      atOptions = {
        'key' : '600c9dfc1de05f87b389e7897fea5a45',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    const invokeScript = document.createElement("script");
    invokeScript.src =
      "https://www.highperformanceformat.com/600c9dfc1de05f87b389e7897fea5a45/invoke.js";

    containerRef.current.appendChild(optionsScript);
    containerRef.current.appendChild(invokeScript);
  }, []);

  useEffect(() => {
    loadAd();
    const interval = setInterval(loadAd, 30000);
    return () => clearInterval(interval);
  }, [loadAd]);

  return (
    <div className="flex justify-center">
      <div
        ref={containerRef}
        style={{ width: 300, height: 250 }}
      />
    </div>
  );
}
