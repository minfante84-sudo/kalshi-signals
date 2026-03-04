import { HelpCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Kalshi prediction markets and how Kalshi Signals helps you find trades to tail.",
};

const faqs: { q: string; a: string | string[] }[] = [
  {
    q: "What is Kalshi?",
    a: [
      "Kalshi is a federally regulated prediction market exchange supervised by the CFTC (Commodity Futures Trading Commission). It lets you buy and sell contracts on the outcome of real-world events — everything from politics and economics to sports, crypto prices, and weather.",
      "Each contract is priced between 1¢ and 99¢ and pays out $1.00 if the event happens or $0.00 if it doesn't. The market price reflects the crowd's real-money estimate of the probability of an outcome.",
    ],
  },
  {
    q: "How do Kalshi contracts work?",
    a: [
      "Every Kalshi market is a yes-or-no question — for example, \"Will Bitcoin be above $100,000 on March 31?\" You can buy a Yes contract if you think it will happen, or a No contract if you think it won't.",
      "If you buy a Yes contract at 65¢ and the event occurs, you receive $1.00 — a profit of 35¢ per contract. If the event doesn't occur, you lose your 65¢. The price you pay reflects the implied probability the market assigns to the outcome.",
    ],
  },
  {
    q: "Is Kalshi legal?",
    a: "Yes. Kalshi is a CFTC-regulated designated contract market (DCM), making it the first legal, regulated exchange for event contracts in the United States. All trades are cleared through regulated infrastructure, and the platform is required to follow strict compliance and reporting standards.",
  },
  {
    q: "What is Kalshi Signals?",
    a: "Kalshi Signals is a free tool that tracks the largest individual trades placed across every active market on Kalshi in real time. It surfaces where big money is moving — helping you quickly spot markets with high-conviction bets before they make headlines.",
  },
  {
    q: "What does \"tailing\" a trade mean?",
    a: "Tailing means following the lead of another trader's position. When you see a large trade on Kalshi Signals — say, someone buying $2,000 worth of Yes contracts on a single market — you might choose to place a similar trade based on the assumption that the large trader has done their research. It's a common strategy in sports betting and financial markets alike.",
  },
  {
    q: "How can Kalshi Signals help me find trades to tail?",
    a: [
      "Kalshi Signals ranks every active market by the size of its largest single trade. This lets you quickly see where someone has put significant money on the line. A $5,000 bet on a single outcome carries more signal than dozens of small $10 trades.",
      "You can use the table to filter by trade size, check whether the big money is on Yes or No, and see how the price has moved since the trade was placed. This gives you a starting point for your own research before deciding whether to follow.",
    ],
  },
  {
    q: "What categories of markets does Kalshi offer?",
    a: "Kalshi covers a wide range of categories including politics (elections, legislation), economics (Fed rate decisions, inflation, GDP), crypto (Bitcoin, Ethereum, Solana price targets), sports (NBA, NFL, soccer, tennis), weather, and cultural events (awards shows, box office). New markets are added regularly.",
  },
  {
    q: "How much money do I need to start trading on Kalshi?",
    a: "You can start with as little as a few dollars. Since contracts are priced in cents, you can buy a single contract for under $1. There are no minimum deposit requirements, making it accessible for beginners who want to start small.",
  },
  {
    q: "What does the price of a Kalshi contract mean?",
    a: "The price represents the market's implied probability. A contract trading at 72¢ means the crowd estimates roughly a 72% chance the event will happen. If you think the real probability is higher, buying Yes is a value play. If you think it's lower, buying No is the move.",
  },
  {
    q: "What do the columns on Kalshi Signals mean?",
    a: [
      "Largest Trade — The dollar value of the biggest single trade placed on that market. This is the primary signal the tool surfaces.",
      "Wager — Whether the large trade was a Yes (bullish on the outcome) or No (bearish) position.",
      "Volume 24h — Total number of contracts traded in the last 24 hours across all participants.",
      "Price — The current last-traded price of the Yes contract, shown in cents.",
      "Change — The percentage change in price over the last 24 hours, indicating momentum.",
    ],
  },
  {
    q: "Is Kalshi Signals financial advice?",
    a: "No. Kalshi Signals is an informational and research tool only. It shows you where large trades are being placed, but it does not recommend any trades. Large trades can lose money just like small ones. Always do your own research and only trade with money you can afford to lose.",
  },
  {
    q: "How often is the data updated?",
    a: "The data on Kalshi Signals refreshes automatically every 30 seconds while you have the page open. You can also click the refresh button to pull the latest trades immediately.",
  },
];

export default function FAQPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
          <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6 text-chart-1" />
          Frequently Asked Questions
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Common questions about Kalshi, prediction markets, and how to use
          Kalshi Signals to find trades.
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <section
            key={i}
            className="rounded-lg border border-border p-6 space-y-3"
          >
            <h2 className="font-semibold">{faq.q}</h2>
            <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              {Array.isArray(faq.a) ? (
                faq.a.map((paragraph, j) => <p key={j}>{paragraph}</p>)
              ) : (
                <p>{faq.a}</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
