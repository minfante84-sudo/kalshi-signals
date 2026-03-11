import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Kalshi Signals.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: March 11, 2026
        </p>
      </div>

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Overview</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Kalshi Signals (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
            &ldquo;our&rdquo;) operates the website kalshisignals.net. This
            page explains what information we collect, how we use it, and your
            choices regarding that information.
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Information We Collect</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            We do not require you to create an account or provide any personal
            information to use Kalshi Signals. We do not collect names, email
            addresses, or other personally identifiable information unless you
            voluntarily provide it through our contact page.
          </p>
          <p>
            <strong className="text-foreground">Analytics:</strong> We use
            Google Analytics to collect anonymous usage data such as page views,
            referring URLs, browser type, device type, and general geographic
            location. This helps us understand how the site is used and improve
            the experience. Google Analytics uses cookies to gather this data.
          </p>
          <p>
            <strong className="text-foreground">Vercel Analytics:</strong> We
            use Vercel Analytics to monitor site performance. This collects
            anonymous performance metrics and does not use cookies or track
            personal information.
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Advertising</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            We display third-party advertisements on our site. These ad
            networks may use cookies, web beacons, or similar technologies to
            serve ads based on your browsing activity. We do not control the
            data collection practices of these third-party ad networks.
          </p>
          <p>
            You can opt out of personalized advertising by adjusting your
            browser&apos;s cookie settings or by visiting industry opt-out
            pages such as the{" "}
            <a
              href="https://optout.networkadvertising.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline hover:no-underline"
            >
              Network Advertising Initiative
            </a>{" "}
            or{" "}
            <a
              href="https://optout.aboutads.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline hover:no-underline"
            >
              Digital Advertising Alliance
            </a>
            .
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Cookies</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Cookies are small text files stored on your device. Our site uses
            cookies through Google Analytics and third-party ad networks. You
            can disable cookies in your browser settings, though this may
            affect some site functionality.
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Third-Party Links</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Our site contains links to Kalshi and other third-party websites.
            We are not responsible for the privacy practices or content of
            those sites. We encourage you to review their privacy policies
            before providing any personal information.
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Data Retention</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            We do not store any personal data on our servers. Analytics data is
            retained by Google and Vercel according to their respective data
            retention policies.
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Children&apos;s Privacy</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Kalshi Signals is not intended for use by individuals under the age
            of 18. We do not knowingly collect information from children.
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Changes to This Policy</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            We may update this privacy policy from time to time. Any changes
            will be posted on this page with an updated revision date.
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Contact</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            If you have questions about this privacy policy, please reach out
            through our{" "}
            <a
              href="/contact"
              className="text-foreground underline hover:no-underline"
            >
              contact page
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
