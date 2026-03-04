import { Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Kalshi Signals team.",
};

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
          <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-chart-1" />
          Contact Us
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Have a question, suggestion, or just want to say hello? We&apos;d love
          to hear from you.
        </p>
      </div>

      <section className="rounded-lg border border-border p-6 space-y-3">
        <h2 className="font-semibold">Email</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Reach us anytime at{" "}
          <a
            href="mailto:kalshisignals@gmail.com"
            className="text-chart-1 underline underline-offset-4 hover:text-foreground transition-colors"
          >
            kalshisignals@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}
