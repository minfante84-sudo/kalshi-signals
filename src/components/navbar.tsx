import Link from "next/link";
import { Activity } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Activity className="h-5 w-5 text-chart-1" />
          <span>Kalshi Signals</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Signals
          </Link>
          <Link
            href="/markets"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Markets
          </Link>
        </nav>
      </div>
    </header>
  );
}
