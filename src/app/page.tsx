import Link from "next/link";
import { Activity, DollarSign, TrendingUp, Newspaper, Flame, Sparkles } from "lucide-react";

const pages = [
  {
    title: "Signals",
    href: "/signals",
    icon: DollarSign,
    description:
      "See the largest single trades happening across every active Kalshi market. Spot where big money is flowing in real time.",
  },
  {
    title: "Popular",
    href: "/popular",
    icon: Flame,
    description:
      "Markets ranked by total cash inflow. Find the most actively traded markets where the most money is changing hands.",
  },
  {
    title: "Blog",
    href: "/blog",
    icon: Newspaper,
    description:
      "Analysis, guides, and insights on prediction market trading strategies, market trends, and Kalshi tips.",
  },
  {
    title: "Trending",
    href: "/trending",
    icon: TrendingUp,
    description:
      "Markets with the biggest price swings in the last 24 hours. See which events are rapidly shifting in probability.",
  },
  {
    title: "New Markets",
    href: "/new-markets",
    icon: Sparkles,
    description:
      "The newest markets listed on Kalshi. Get in early on fresh markets before they gain widespread attention.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Activity className="h-6 w-6 text-chart-1" />
        <h1 className="text-xl sm:text-2xl font-bold">Kalshi Signals</h1>
      </div>

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">How To Use Kalshi Signals</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Kalshi Signals tracks the largest individual trades happening across
            every active market on Kalshi, updated in real time. When someone
            places an unusually large bet — often hundreds or thousands of
            dollars on a single contract — it can indicate strong conviction
            about an outcome.
          </p>
          <p>
            Use this data to spot where informed money is flowing. A surge of
            large &ldquo;Yes&rdquo; trades on a market may signal growing
            confidence that an event will happen, while large &ldquo;No&rdquo;
            trades suggest the opposite. Combined with price changes and volume,
            these signals help you identify markets with meaningful activity
            before they make headlines.
          </p>
          <p>
            This tool is for informational and research purposes only. It does
            not constitute financial advice. Always do your own research before
            making any trading decisions.
          </p>
          <p>
            Kalshi Signals is in no way affiliated with or endorsed by Kalshi.
          </p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="group rounded-lg border border-border p-5 transition-colors hover:border-chart-1/50 hover:bg-accent/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <page.icon className="h-5 w-5 text-chart-1" />
              <h3 className="font-semibold group-hover:text-foreground">
                {page.title}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {page.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
