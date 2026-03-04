"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

function useAdSize() {
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 728, height: 90 });

  useEffect(() => {
    function update() {
      if (window.innerWidth < 468) {
        setSize({ width: 320, height: 50 });
      } else if (window.innerWidth < 768) {
        setSize({ width: 468, height: 60 });
      } else {
        setSize({ width: 728, height: 90 });
      }
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

export function AdBanner({ className }: { className?: string }) {
  const pushed = useRef(false);
  const size = useAdSize();

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // ad blocker or script not loaded
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: size.width, height: size.height }}
        data-ad-client="ca-pub-6706124830973350"
        data-ad-slot="6327886268"
      />
    </div>
  );
}

export function AdBannerFooter({ className }: { className?: string }) {
  const pushed = useRef(false);
  const size = useAdSize();

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // ad blocker or script not loaded
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: size.width, height: size.height }}
        data-ad-client="ca-pub-6706124830973350"
        data-ad-slot="6327886268"
      />
    </div>
  );
}
