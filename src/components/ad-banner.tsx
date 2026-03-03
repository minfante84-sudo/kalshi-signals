"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdBanner({ className }: { className?: string }) {
  const pushed = useRef(false);

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
        style={{ display: "inline-block", width: 728, height: 90 }}
        data-ad-client="ca-pub-6706124830973350"
        data-ad-slot="6327886268"
      />
    </div>
  );
}

export function AdBannerFooter({ className }: { className?: string }) {
  const pushed = useRef(false);

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
        style={{ display: "inline-block", width: 728, height: 90 }}
        data-ad-client="ca-pub-6706124830973350"
        data-ad-slot="6327886268"
      />
    </div>
  );
}
