import type { Metadata } from "next";
import { Bot, Braces, Sparkles } from "lucide-react";
import { CodeExplainerTool } from "@/components/code-explainer-tool";
import { Reveal } from "@/components/reveal";
import { getSEOSettings } from "@/lib/api";
import { metadataFromSEOPage, webPageJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOSettings();
  return metadataFromSEOPage(seo, "code-explainer", {
    title: "Code Explainer",
    description: "AI code explainer for understanding snippets, patterns, and implementation details.",
    path: "/code-explainer",
    image: seo?.global.og_image_url,
    keywords: seo?.global.site_keywords,
  });
}

export default async function CodeExplainerPage() {
  const seo = await getSEOSettings();
  const pageJsonLd = seo?.pages["code-explainer"] ? webPageJsonLd(seo.pages["code-explainer"], seo) : null;
  return (
    <>
      {pageJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} /> : null}
      <section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_45%,#f5f3ff_100%)] pt-24 dark:border-slate-800 dark:bg-[linear-gradient(135deg,#020617_0%,#071826_52%,#160f2a_100%)] sm:pt-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.055)_1px,transparent_1px)]" />
        <div className="absolute left-[-4rem] top-24 size-72 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-400/12" />
        <div className="absolute right-[-5rem] bottom-[-5rem] size-80 rounded-full bg-fuchsia-300/20 blur-3xl dark:bg-fuchsia-500/12" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-sm font-semibold text-cyan-800 shadow-sm backdrop-blur dark:border-cyan-400/20 dark:bg-slate-950/70 dark:text-cyan-200">
                  <Bot className="size-4" />
                  AI Tool
                </p>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl dark:text-white">Code Explainer</h1>
                <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                  Paste a snippet, choose the language, and get a structured explanation of what it does, the pattern behind it, and the implementation details.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06]">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                    <Braces className="size-4" />
                    Multi-language
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Go, JS, SQL, Python, React, and custom stacks.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06]">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                    <Sparkles className="size-4" />
                    Streaming
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Answer appears while the backend is generating.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <CodeExplainerTool />
    </>
  );
}
