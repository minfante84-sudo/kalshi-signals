"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Activity, ChevronDown } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Activity className="h-5 w-5 text-chart-1" />
          <span>Kalshi Signals</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 text-sm">
          <Link
            href="/signals"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Signals
          </Link>
          <Link
            href="/popular"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Popular
          </Link>
          <Link
            href="/blog"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Blog
          </Link>
          <Link
            href="/trending"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Trending
          </Link>
          <Link
            href="/new-markets"
            className="hidden sm:inline text-muted-foreground transition-colors hover:text-foreground"
          >
            New
          </Link>
          <Link
            href="/about"
            className="hidden sm:inline text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/faq"
            className="hidden sm:inline text-muted-foreground transition-colors hover:text-foreground"
          >
            FAQ
          </Link>
          {/* More dropdown on mobile only */}
          <div className="relative sm:hidden" ref={menuRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              More
              <ChevronDown className="h-3 w-3" />
            </button>
            {open && (
              <div className="absolute right-0 top-full mt-2 w-36 rounded-md border border-border bg-background shadow-lg z-50">
                <Link
                  href="/new-markets"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  New Markets
                </Link>
                <Link
                  href="/about"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  About
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  FAQ
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
