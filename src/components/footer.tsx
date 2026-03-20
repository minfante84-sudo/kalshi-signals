import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border mt-12">
      <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Kalshi Signals. Not affiliated with Kalshi.</p>
        <nav className="flex items-center gap-4">
          <Link href="/blog" className="hover:text-foreground transition-colors">
            Blog
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
