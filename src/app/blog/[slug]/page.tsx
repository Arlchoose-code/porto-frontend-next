import { ArrowLeft, Bot, Clock, ExternalLink, ImageIcon, PenLine, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogReadingProgress, BlogTableOfContents } from "@/components/blog-reading-tools";
import { MdxRenderer } from "@/components/mdx-renderer";
import { Reveal } from "@/components/reveal";
import { ShareActions } from "@/components/share-actions";
import { absoluteMediaUrl, absoluteSiteUrl, getBlog, getBlogs, mediaUrl } from "@/lib/api";
import { formatLongDate, plainText } from "@/lib/format";
import { breadcrumbJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return {};

  const imageUrl = absoluteMediaUrl(blog.og_image_url ?? blog.thumbnail_url);
  const description = plainText(blog.meta_description ?? blog.summary);
  const canonical = blog.canonical_url || absoluteSiteUrl(`/blog/${blog.slug}`);

  return {
    title: blog.meta_title ?? blog.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: blog.meta_title ?? blog.title,
      description,
      type: "article",
      url: canonical,
      images: imageUrl ? [{ url: imageUrl, alt: blog.title }] : undefined,
      publishedTime: blog.published_at ?? blog.created_at,
      authors: blog.author_display_name ? [blog.author_display_name] : undefined,
      tags: blog.tags ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.meta_title ?? blog.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const blogs = await getBlogs({ limit: 200 });
  return (blogs.data ?? []).map((blog) => ({ slug: blog.slug }));
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  const imageUrl = mediaUrl(blog.thumbnail_url ?? blog.og_image_url);
  const canonical = blog.canonical_url || absoluteSiteUrl(`/blog/${blog.slug}`);
  const related = (await getBlogs({ limit: 6, tag: blog.tags?.[0] })).data?.filter((item) => item.slug !== blog.slug).slice(0, 3) ?? [];
  const toc = extractToc(blog.content || "");
  const imageAbsolute = absoluteMediaUrl(blog.og_image_url ?? blog.thumbnail_url);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: plainText(blog.meta_description ?? blog.summary),
    image: imageAbsolute ? [imageAbsolute] : undefined,
    datePublished: blog.published_at ?? blog.created_at,
    dateModified: blog.updated_at,
    author: { "@type": "Person", name: blog.author_display_name },
    mainEntityOfPage: canonical,
  };
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: blog.title, path: `/blog/${blog.slug}` },
  ]);

  return (
    <main className="bg-[#f6f9fc] text-slate-950 dark:bg-[#020617] dark:text-white">
      <BlogReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_45%,#f5f3ff_100%)] pt-24 dark:bg-[linear-gradient(135deg,#020617_0%,#071826_52%,#160f2a_100%)] sm:pt-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.055)_1px,transparent_1px)]" />
        <div className="absolute left-[-4rem] top-24 size-72 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-400/12" />
        <div className="absolute right-[-5rem] bottom-[-5rem] size-80 rounded-full bg-fuchsia-300/20 blur-3xl dark:bg-fuchsia-500/12" />
        <div className="relative mx-auto max-w-5xl px-4 pb-14 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col items-start gap-5">
              <Link className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white" href="/blog">
                <ArrowLeft className="size-4" />
                Back to blog
              </Link>
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-sm font-semibold text-cyan-800 shadow-sm backdrop-blur dark:border-cyan-400/20 dark:bg-slate-950/70 dark:text-cyan-200">
                <PenLine className="size-4" />
                Article
              </p>
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">{blog.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">{plainText(blog.summary)}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-950/70">
                <Clock className="size-4" />
                {formatLongDate(blog.published_at ?? blog.created_at)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-950/70">
                <Clock className="size-4" />
                {blog.reading_time || 1} min read
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-950/70">
                <UserRound className="size-4" />
                {blog.author_display_name}
              </span>
            </div>
            <div className="mt-6">
              <ShareActions title={blog.title} url={canonical} />
            </div>
          </Reveal>
        </div>
      </section>

      <article className="relative border-t border-slate-200 py-16 dark:border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(168,85,247,0.1),transparent_24%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_300px] lg:px-8">
          <div className="min-w-0">
          <Reveal>
            <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900">
              {imageUrl ? (
                <Image
                  alt={blog.title}
                  className="object-cover"
                  fill
                  priority
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  src={imageUrl}
                />
              ) : (
                <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_42%)] text-cyan-700 dark:text-cyan-300">
                  <ImageIcon className="size-12" />
                </div>
              )}
            </div>
          </Reveal>

          {blog.author_type === "ai" ? (
            <Reveal delay={0.04}>
              <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-100">
                <p className="inline-flex items-center gap-2 font-semibold">
                  <Bot className="size-4" />
                  This article was generated by Syahril&apos;s AI Assistant.
                </p>
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={0.08}>
            <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950 sm:p-8">
              <MdxRenderer content={blog.content || blog.summary} />
            </div>
          </Reveal>

          {(blog.tags ?? []).length > 0 ? (
            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap gap-2">
                {(blog.tags ?? []).map((tag) => (
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          ) : null}

          {(blog.generation_sources ?? []).length > 0 ? (
            <Reveal delay={0.12}>
              <section className="mt-8 rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950">
                <h2 className="font-semibold">Sources</h2>
                <div className="mt-3 grid gap-2">
                  {(blog.generation_sources ?? []).map((source) => (
                    <a className="inline-flex min-w-0 items-center gap-2 break-words rounded-2xl border border-slate-200 bg-[#f8fafc] px-3 py-3 text-sm font-medium text-cyan-700 transition hover:border-cyan-300 dark:border-slate-800 dark:bg-[#020617] dark:text-cyan-300" href={source.url} key={source.url} rel="noreferrer" target="_blank">
                      <ExternalLink className="size-4 shrink-0" />
                      <span className="min-w-0 break-all">{source.label || source.url}</span>
                    </a>
                  ))}
                </div>
              </section>
            </Reveal>
          ) : null}

          {related.length > 0 ? (
            <Reveal delay={0.14}>
              <section className="mt-8 rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950">
                <h2 className="font-semibold">Related articles</h2>
                <div className="mt-4 grid gap-3">
                  {related.map((item) => (
                    <Link className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-slate-800 dark:bg-[#020617]" href={`/blog/${item.slug}`} key={item.id}>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{plainText(item.summary)}</p>
                    </Link>
                  ))}
                </div>
              </section>
            </Reveal>
          ) : null}
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <BlogTableOfContents items={toc} />
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}

function extractToc(content: string) {
  const matches = Array.from(content.matchAll(/<h([2-3])[^>]*>(.*?)<\/h\1>/gi));
  return matches.slice(0, 12).map((match) => {
    const text = plainText(match[2]);
    return { id: slugify(text), text };
  }).filter((item) => item.id && item.text);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}
