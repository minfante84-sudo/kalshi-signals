"use client";

import { useEffect, useRef } from "react";

export function InlineAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    const bannerScript = document.createElement("script");
    bannerScript.async = true;
    bannerScript.referrerPolicy = "no-referrer-when-downgrade";
    bannerScript.src =
      "//conventionalresponse.com/b/XOVistd.Gflm0GYUWEcj/MeQmd9/u/ZPUElBkiPBTtYO4gNsT/MQyrO/TPM-tcNEjsgS1JMNz/Iy5/NzwF";
    containerRef.current.appendChild(bannerScript);

    const videoScript = document.createElement("script");
    videoScript.async = true;
    videoScript.referrerPolicy = "no-referrer-when-downgrade";
    videoScript.src =
      "//conventionalresponse.com/bxXKVjs.dnGuld0mYdWrct/teAmK9/uTZwUzlgkaPCTfY/4wNWTOMtz-MKD_kctrNzj/g/1rMOzQM/x/MhwK";
    containerRef.current.appendChild(videoScript);
  }, []);

  return (
    <div className="flex justify-center" ref={containerRef} />
  );
}
