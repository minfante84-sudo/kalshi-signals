"use client";

import { useEffect, useRef } from "react";

export function InlineAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    const script = document.createElement("script");
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";
    script.src =
      "//conventionalresponse.com/b/XOVistd.Gflm0GYUWEcj/MeQmd9/u/ZPUElBkiPBTtYO4gNsT/MQyrO/TPM-tcNEjsgS1JMNz/Iy5/NzwF";
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="flex justify-center" ref={containerRef} />
  );
}
