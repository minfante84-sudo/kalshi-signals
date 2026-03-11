"use client";

import { useEffect, useRef, useCallback } from "react";

export function DesktopAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  const loadAd = useCallback(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const optionsScript = document.createElement("script");
    optionsScript.text = `
      atOptions = {
        'key' : '9833218a541be5b4bc8c5d2a28bef9ca',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    const invokeScript = document.createElement("script");
    invokeScript.src =
      "https://www.highperformanceformat.com/9833218a541be5b4bc8c5d2a28bef9ca/invoke.js";

    containerRef.current.appendChild(optionsScript);
    containerRef.current.appendChild(invokeScript);
  }, []);

  useEffect(() => {
    loadAd();
    const interval = setInterval(loadAd, 30000);
    return () => clearInterval(interval);
  }, [loadAd]);

  return (
    <div
      ref={containerRef}
      className="hidden md:flex justify-center bg-black"
      style={{ width: "100%", height: 90 }}
    />
  );
}
