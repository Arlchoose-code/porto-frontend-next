import type { Metadata } from "next";
import Link from "next/link";
import { FolderKanban, Search, SlidersHorizontal, X } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { getProjects, getSEOSettings } from "@/lib/api";
import { collectionJsonLd, metadataFromSEOPage, webPageJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOSettings();
  return metadataFromSEOPage(seo, "projects", {
    title: "Projects",
    description: "Published AI, backend, frontend, and full-stack projects.",
    path: "/projects",
    image: seo?.global.og_image_url,
    keywords: seo?.global.site_keywords,
  });
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; tech?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const search = params.search?.trim() ?? "";
  const tech = params.tech?.trim() ?? "";
  const [projects, filterSource] = await Promise.all([
    getProjects({ page, limit: 9, search, tech }),
    getProjects({ limit: 100 }),
  ]);

  const allTech = Array.from(
    new Set((filterSource.data ?? []).flatMap((project) => project.tech_stack ?? [])),
  ).sort();
  const seo = await getSEOSettings();
  const pageJsonLd = seo?.pages.projects ? webPageJsonLd(seo.pages.projects, seo) : null;
  const collectionLd = collectionJsonLd({
    name: "Projects",
    description: seo?.pages.projects?.description ?? "Portfolio projects and case studies.",
    path: "/projects",
    items: (projects.data ?? []).map((project) => ({ name: project.title, url: `/projects/${project.slug}` })),
  });

  return (
    <main className="bg-[#f6f9fc] text-slate-950 dark:bg-[#020617] dark:text-white">
      {pageJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} /> : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_45%,#f5f3ff_100%)] pt-24 dark:bg-[linear-gradient(135deg,#020617_0%,#071826_52%,#160f2a_100%)] sm:pt-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.055)_1px,transparent_1px)]" />
        <div className="absolute left-[-4rem] top-24 size-72 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-400/12" />
        <div className="absolute right-[-5rem] bottom-[-5rem] size-80 rounded-full bg-fuchsia-300/20 blur-3xl dark:bg-fuchsia-500/12" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-sm font-semibold text-cyan-800 shadow-sm backdrop-blur dark:border-cyan-400/20 dark:bg-slate-950/70 dark:text-cyan-200">
                  <FolderKanban className="size-4" />
                  Build archive
                </p>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">Projects</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                  Published builds, AI experiments, backend systems, and production-facing web applications.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">
                <span className="block text-2xl font-semibold text-slate-950 dark:text-white">{projects.meta?.total ?? (projects.data ?? []).length}</span>
                results indexed
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form className="mt-10 grid gap-3 rounded-[1.5rem] border border-slate-200 bg-white/85 p-3 shadow-xl shadow-slate-950/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.08] sm:grid-cols-[1fr_240px_auto_auto]">
              <input name="page" type="hidden" value="1" />
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-cyan-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-500"
                  defaultValue={search}
                  name="search"
                  placeholder="Search projects"
                />
              </label>
              <label className="relative block">
                <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <select
                  className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition focus:border-cyan-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-500"
                  defaultValue={tech}
                  name="tech"
                >
                  <option value="">All tech</option>
                  {allTech.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950" type="submit">
                Filter
              </button>
              {search || tech ? (
                <Link className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200" href="/projects">
                  Clear <X className="size-4" />
                </Link>
              ) : null}
            </form>
          </Reveal>
        </div>
      </section>

      <section className="relative border-t border-slate-200 py-16 dark:border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(16,185,129,0.1),transparent_24%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-3">
            {(projects.data ?? []).map((project, index) => (
              <Reveal className="h-full" delay={Math.min(index * 0.04, 0.2)} key={project.id}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
          {(projects.data ?? []).length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              No published projects found.
            </p>
          ) : null}
          <Pagination meta={projects.meta} searchParams={{ search, tech }} />
        </div>
      </section>
    </main>
  );
}
