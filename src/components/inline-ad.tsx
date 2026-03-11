"use client";

import { useEffect, useRef, useCallback } from "react";

export function InlineAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  const loadAd = useCallback(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.text = `
      (function() {
        atOptions = {
          'key' : '600c9dfc1de05f87b389e7897fea5a45',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
        var s = document.createElement('script');
        s.src = 'https://www.highperformanceformat.com/600c9dfc1de05f87b389e7897fea5a45/invoke.js';
        document.getElementById('inline-ad-container').appendChild(s);
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
    <div className="flex justify-center">
      <div
        ref={containerRef}
        id="inline-ad-container"
        style={{ width: 300, height: 250 }}
      />
    </div>
  );
}
