"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function MobileAdUnit() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";
    script.src =
      "//conventionalresponse.com/b.XVVXs-dCGYlU0iYTW/cA/De/mI9/uTZjU/lbkLPoTIYM4sNITMMYx_N/jgE/t-Nyjmgf1LM/zVEJ2/NuQD";
    containerRef.current.appendChild(script);
  }, []);

  return <div ref={containerRef} />;
}

export function MobileAd() {
  const pathname = usePathname();
  const keyRef = useRef(0);
  const prevPathRef = useRef(pathname);

  if (pathname !== prevPathRef.current) {
    keyRef.current += 1;
    prevPathRef.current = pathname;
  }

  return (
    <div
      className="flex justify-center md:hidden bg-black"
      style={{ minHeight: 100 }}
    >
      <MobileAdUnit key={keyRef.current} />
    </div>
  );
}
