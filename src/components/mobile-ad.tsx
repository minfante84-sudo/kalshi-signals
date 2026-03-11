"use client";

import { useEffect, useRef } from "react";

export function MobileAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

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

  return (
    <div
      ref={containerRef}
      className="flex justify-center md:hidden bg-black"
      style={{ width: "100%", height: 50 }}
    />
  );
}
