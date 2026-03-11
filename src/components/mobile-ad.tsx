"use client";

import { useEffect, useRef, useCallback } from "react";

export function MobileAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  const loadAd = useCallback(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.text = `
      (function() {
        atOptions = {
          'key' : 'fc44b092dbf032c9495ba9db4aff2cdc',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
        var s = document.createElement('script');
        s.src = 'https://www.highperformanceformat.com/fc44b092dbf032c9495ba9db4aff2cdc/invoke.js';
        document.getElementById('mobile-ad-container').appendChild(s);
      })();
    `;

    containerRef.current.appendChild(script);
  }, []);

  useEffect(() => {
    loadAd();
    const interval = setInterval(loadAd, 30000);
    return () => clearInterval(interval);
  }, [loadAd]);

  return (
    <div
      ref={containerRef}
      id="mobile-ad-container"
      className="flex justify-center md:hidden bg-black"
      style={{ width: "100%", height: 50 }}
    />
  );
}
