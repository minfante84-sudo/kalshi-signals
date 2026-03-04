"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const adStyles = `
  .ad-container ins {
    display: inline-block !important;
    width: 320px;
    height: 50px;
  }
  @media (min-width: 468px) {
    .ad-container ins {
      width: 468px;
      height: 60px;
    }
  }
  @media (min-width: 768px) {
    .ad-container ins {
      width: 728px;
      height: 90px;
    }
  }
`;

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
    <div className={`ad-container ${className ?? ""}`}>
      <style dangerouslySetInnerHTML={{ __html: adStyles }} />
      <ins
        className="adsbygoogle"
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
    <div className={`ad-container ${className ?? ""}`}>
      <ins
        className="adsbygoogle"
        data-ad-client="ca-pub-6706124830973350"
        data-ad-slot="6327886268"
      />
    </div>
  );
}
