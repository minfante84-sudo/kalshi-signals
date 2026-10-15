import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { posts, getPost } from "../posts";

const siteUrl = "https://kalshisignals.net";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `${siteUrl}/blog/${post.slug}`,
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    author: { "@type": "Organization", name: "Kalshi Signals", url: siteUrl },
    publisher: { "@type": "Organization", name: "Kalshi Signals", url: siteUrl },
  };

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Blog
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold">{post.title}</h1>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <time dateTime={post.date}>{post.date}</time>
          <span>{post.readingTime}</span>
        </div>
      </div>

      <div className="prose-custom">
        {post.content.split("\n\n").map((block, i) => {
          if (block.startsWith("## ")) {
            return (
              <h2
                key={i}
                className="text-lg font-semibold mt-8 mb-3 text-foreground"
              >
                {block.replace("## ", "")}
              </h2>
            );
          }
          if (block.startsWith("**") && block.endsWith("**")) {
            return (
              <p
                key={i}
                className="text-sm text-foreground font-semibold leading-relaxed mb-3"
              >
                {block.replace(/\*\*/g, "")}
              </p>
            );
          }
          // Handle paragraphs with bold text inline
          const parts = block.split(/(\*\*[^*]+\*\*)/g);
          return (
            <p
              key={i}
              className="text-sm text-muted-foreground leading-relaxed mb-3"
            >
              {parts.map((part, j) =>
                part.startsWith("**") && part.endsWith("**") ? (
                  <strong key={j} className="text-foreground font-semibold">
                    {part.replace(/\*\*/g, "")}
                  </strong>
                ) : (
                  <span key={j}>{part}</span>
                )
              )}
            </p>
          );
        })}
      </div>

      <div className="border-t border-border pt-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-chart-1 hover:text-chart-1/80 transition-colors font-medium"
        >
          <ArrowLeft className="h-3 w-3" />
          All articles
        </Link>
      </div>
    </article>
  );
}
