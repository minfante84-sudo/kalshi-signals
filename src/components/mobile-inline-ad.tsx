"use client";

import { useEffect, useRef } from "react";

export function MobileInlineAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    const script = document.createElement("script");
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";
    script.src =
      "//conventionalresponse.com/bcXSV.sJddGolB0EYsWbc-/_eOmf9Wu/ZsUIllkjPgTQY/4lNjTpQ/ypM/zjMptINHjgg/1MNZDtIZzGNGwn";
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      className="flex justify-center md:hidden bg-black rounded-lg"
      style={{ minHeight: 100 }}
      ref={containerRef}
    />
  );
}
