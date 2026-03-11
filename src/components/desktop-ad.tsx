"use client";

import { useEffect, useRef, useCallback } from "react";

export function DesktopAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  const loadAd = useCallback(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.text = `
      (function() {
        atOptions = {
          'key' : '9833218a541be5b4bc8c5d2a28bef9ca',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
        var s = document.createElement('script');
        s.src = 'https://www.highperformanceformat.com/9833218a541be5b4bc8c5d2a28bef9ca/invoke.js';
        document.getElementById('desktop-ad-container').appendChild(s);
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
      id="desktop-ad-container"
      className="hidden md:flex justify-center bg-black"
      style={{ width: "100%", height: 90 }}
    />
  );
}
