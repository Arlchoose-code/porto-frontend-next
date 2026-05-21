import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileSearch, Search } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { getSEOSettings, searchPortfolio } from "@/lib/api";
import { plainText } from "@/lib/format";
import { metadataFromSEOPage, webPageJsonLd } from "@/lib/seo";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const [params, seo] = await Promise.all([searchParams, getSEOSettings()]);
  return metadataFromSEOPage(seo, "search", {
    title: "Search",
    description: "Search Syahril Haryono portfolio projects and articles.",
    path: "/search",
    image: seo?.global.og_image_url,
    keywords: seo?.global.site_keywords,
    noindex: Boolean(params.q),
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const [resultsResponse, seo] = await Promise.all([
    query ? searchPortfolio(query) : Promise.resolve({ success: true, data: [] }),
    getSEOSettings(),
  ]);
  const results = resultsResponse.data ?? [];
  const pageJsonLd = seo?.pages.search ? webPageJsonLd(seo.pages.search, seo) : null;

  return (
    <main className="bg-[#f6f9fc] text-slate-950 dark:bg-[#020617] dark:text-white">
      {pageJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} /> : null}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_45%,#f5f3ff_100%)] pt-24 dark:bg-[linear-gradient(135deg,#020617_0%,#071826_52%,#160f2a_100%)] sm:pt-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.055)_1px,transparent_1px)]" />
        <div className="relative mx-auto max-w-5xl px-4 pb-14 sm:px-6 lg:px-8">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-sm font-semibold text-cyan-800 shadow-sm backdrop-blur dark:border-cyan-400/20 dark:bg-slate-950/70 dark:text-cyan-200">
              <FileSearch className="size-4" />
              Smart search
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">Search</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Search across public projects and blog articles.
            </p>
            <form className="mt-8 flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-white/85 p-3 shadow-xl shadow-slate-950/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.08] sm:flex-row">
              <label className="relative block flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-cyan-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-500" defaultValue={query} name="q" placeholder="Search projects or articles" />
              </label>
              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950" type="submit">
                Search
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-slate-200 py-16 dark:border-slate-800">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {query ? (
            <p className="mb-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
              {results.length} result(s) for &quot;{query}&quot;
            </p>
          ) : null}
          <div className="grid gap-3">
            {results.map((item) => {
              const href = item.url || `/${item.type === "blog" ? "blog" : "projects"}/${item.slug}`;
              return (
                <Reveal key={`${item.type}-${item.id}`}>
                  <Link className="block rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-slate-800 dark:bg-slate-950" href={href}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-200">{item.type}</span>
                      <ArrowRight className="size-4 text-slate-400" />
                    </div>
                    <h2 className="mt-3 text-xl font-semibold">{item.title}</h2>
                    {item.summary ? <p className="mt-2 line-clamp-2 leading-7 text-slate-600 dark:text-slate-300">{plainText(item.summary)}</p> : null}
                  </Link>
                </Reveal>
              );
            })}
          </div>
          {query && results.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              No result found.
            </p>
          ) : null}
          {!query ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              Type a keyword to search the portfolio.
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
