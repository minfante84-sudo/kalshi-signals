import { Info } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn what Kalshi Signals does and how to use it to track prediction market activity.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
          <Info className="h-5 w-5 sm:h-6 sm:w-6 text-chart-1" />
          About Kalshi Signals
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A free, independent tool for tracking activity across Kalshi
          prediction markets.
        </p>
      </div>

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">What is Kalshi Signals?</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Kalshi Signals gives you a real-time window into what&apos;s
            happening across Kalshi&apos;s prediction markets. Instead of
            browsing hundreds of individual markets, you can use our tools to
            quickly spot where the action is — large trades being placed,
            prices shifting, and new markets opening up.
          </p>
          <p>
            Whether you&apos;re a trader looking for opportunities, a
            researcher tracking public sentiment, or just curious about what
            people are betting on, Kalshi Signals helps you cut through the
            noise and focus on what matters.
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">What You Can Do</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong className="text-foreground">Signals</strong> — See the
              largest individual trades happening right now. When someone places
              a big bet, it often signals strong conviction about an outcome.
            </li>
            <li>
              <strong className="text-foreground">Popular</strong> — Find
              markets with the most total cash flowing in, split by Yes and No
              positions, so you can see where the crowd is putting its money.
            </li>
            <li>
              <strong className="text-foreground">Trending</strong> — Spot
              markets with the biggest price swings in the last 24 hours.
              Rising or falling prices can indicate shifting sentiment.
            </li>
            <li>
              <strong className="text-foreground">New Markets</strong> — Browse
              the latest markets listed on Kalshi. Get in early on fresh events
              before they attract heavy volume.
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">What is Kalshi?</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Kalshi is a federally regulated prediction market exchange where
            traders buy and sell contracts on the outcome of real-world events.
            Regulated by the CFTC (Commodity Futures Trading Commission), Kalshi
            lets you trade on topics ranging from politics and economics to
            sports, crypto prices, and weather.
          </p>
          <p>
            Each contract is priced between 1&cent; and 99&cent; and pays out
            $1.00 if the event occurs or $0.00 if it doesn&apos;t. The market
            price reflects the crowd&apos;s real-time estimate of the
            probability of an outcome — a contract trading at 72&cent; implies
            roughly a 72% chance the event happens.
          </p>
          <p>
            Unlike traditional polling or pundit predictions, Kalshi prices are
            backed by real money, giving them a unique signal about how
            participants actually assess risk and probability.
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Disclaimer</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Kalshi Signals is for informational and research purposes only. It
            does not constitute financial advice. Always do your own research
            before making any trading decisions.
          </p>
          <p>
            Kalshi Signals is in no way affiliated with or endorsed by Kalshi.
          </p>
        </div>
      </section>
    </div>
  );
}
