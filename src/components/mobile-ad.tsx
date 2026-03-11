"use client";

import { useEffect, useRef, useCallback } from "react";

export function MobileAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  const loadAd = useCallback(() => {
    if (!containerRef.current) return;

    // Clear previous ad content
    containerRef.current.innerHTML = "";

    const optionsScript = document.createElement("script");
    optionsScript.text = `
      atOptions = {
        'key' : 'fc44b092dbf032c9495ba9db4aff2cdc',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `;

    const invokeScript = document.createElement("script");
    invokeScript.src =
      "https://www.highperformanceformat.com/fc44b092dbf032c9495ba9db4aff2cdc/invoke.js";

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
      className="flex justify-center md:hidden bg-black"
      style={{ width: "100%", height: 50 }}
    />
  );
}
