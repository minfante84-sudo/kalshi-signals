import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { posts } from "./posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Learn about prediction markets, trading strategies, and how to use market data to make better-informed decisions.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
          <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-chart-1" />
          Blog
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Guides and insights on prediction markets, trading strategies, and
          market analysis.
        </p>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
            <article className="rounded-lg border border-border p-6 space-y-2 transition-colors hover:border-chart-1/50 hover:bg-accent/30">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <time>{post.date}</time>
                <span>{post.readingTime}</span>
              </div>
              <h2 className="font-semibold text-foreground">{post.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {post.description}
              </p>
              <span className="inline-flex items-center gap-1 text-xs text-chart-1 font-medium">
                Read article <ArrowRight className="h-3 w-3" />
              </span>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
