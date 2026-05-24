import { ArrowLeft, Code2, ExternalLink, ImageIcon, Layers3, RadioTower } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MdxRenderer } from "@/components/mdx-renderer";
import { ProjectExplainer } from "@/components/project-explainer";
import { Reveal } from "@/components/reveal";
import { ShareActions } from "@/components/share-actions";
import { absoluteMediaUrl, absoluteSiteUrl, getProject, getProjects, mediaUrl } from "@/lib/api";
import { plainText } from "@/lib/format";
import { breadcrumbJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  const imageUrl = absoluteMediaUrl(project.og_image_url ?? project.thumbnail_url);
  const description = plainText(project.meta_description ?? project.summary);
  const canonical = absoluteSiteUrl(`/projects/${project.slug}`);

  return {
    title: project.meta_title ?? project.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: project.meta_title ?? project.title,
      description,
      type: "article",
      url: canonical,
      images: imageUrl ? [{ url: imageUrl, alt: project.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.meta_title ?? project.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const projects = await getProjects({ limit: 200 });
  return (projects.data ?? []).map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const imageUrl = mediaUrl(project.thumbnail_url ?? project.og_image_url);
  const canonical = absoluteSiteUrl(`/projects/${project.slug}`);
  const related = (await getProjects({ limit: 6, tech: project.tech_stack?.[0] })).data?.filter((item) => item.slug !== project.slug).slice(0, 3) ?? [];
  const imageAbsolute = absoluteMediaUrl(project.og_image_url ?? project.thumbnail_url);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: plainText(project.meta_description ?? project.summary),
    image: imageAbsolute,
    url: canonical,
    applicationCategory: "DeveloperApplication",
    programmingLanguage: project.tech_stack ?? undefined,
  };
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: project.title, path: `/projects/${project.slug}` },
  ]);
  const links = [
    project.github_url ? { label: "GitHub", url: project.github_url, icon: Code2 } : null,
    project.live_url ? { label: "Live", url: project.live_url, icon: ExternalLink } : null,
    project.huggingface_url ? { label: "HuggingFace", url: project.huggingface_url, icon: ExternalLink } : null,
    ...(project.other_links ?? []).map((link) => ({ ...link, icon: ExternalLink })),
  ].filter(Boolean);

  return (
    <main className="bg-[#f6f9fc] text-slate-950 dark:bg-[#020617] dark:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_45%,#f5f3ff_100%)] pt-24 dark:bg-[linear-gradient(135deg,#020617_0%,#071826_52%,#160f2a_100%)] sm:pt-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.055)_1px,transparent_1px)]" />
        <div className="absolute left-[-4rem] top-24 size-72 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-400/12" />
        <div className="absolute right-[-5rem] bottom-[-5rem] size-80 rounded-full bg-fuchsia-300/20 blur-3xl dark:bg-fuchsia-500/12" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <Reveal>
            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white" href="/projects">
              <ArrowLeft className="size-4" />
              Back to projects
            </Link>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-sm font-semibold text-cyan-800 shadow-sm backdrop-blur dark:border-cyan-400/20 dark:bg-slate-950/70 dark:text-cyan-200">
                  <Layers3 className="size-4" />
                  {project.featured ? "Featured project" : "Project detail"}
                </p>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">{project.title}</h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">{plainText(project.summary)}</p>
                <div className="mt-6">
                  <ShareActions title={project.title} url={canonical} />
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06]">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                  <RadioTower className="size-4" />
                  Status
                </p>
                <p className="mt-2 text-2xl font-semibold capitalize">{project.status || "published"}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Stack and external links are available below.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <article className="relative border-t border-slate-200 py-16 dark:border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(16,185,129,0.1),transparent_24%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          <div className="min-w-0">
            <Reveal>
              <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900">
                {imageUrl ? (
                  <Image
                    alt={project.title}
                    className="object-cover"
                    fill
                    priority
                    sizes="(min-width: 1024px) 820px, 100vw"
                    src={imageUrl}
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_42%)] text-cyan-700 dark:text-cyan-300">
                    <ImageIcon className="size-12" />
                  </div>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950 sm:p-8">
                <MdxRenderer content={project.description || project.summary} />
              </div>
            </Reveal>
          </div>

          <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
            <Reveal delay={0.08}>
              <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950">
                <h2 className="font-semibold">Tech stack</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(project.tech_stack ?? []).length ? (
                    (project.tech_stack ?? []).map((tech) => (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200" key={tech}>
                        {tech}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No stack listed.</p>
                  )}
                </div>
              </section>
            </Reveal>

            {links.length > 0 ? (
              <Reveal delay={0.12}>
                <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950">
                  <h2 className="mb-4 font-semibold">Links</h2>
                  <div className="grid gap-2">
                    {links.map((link) => {
                      if (!link) return null;
                      const Icon = link.icon;
                      return (
                        <a className="inline-flex items-center justify-between rounded-2xl border border-slate-200 bg-[#f8fafc] px-3 py-3 text-sm font-medium transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-slate-800 dark:bg-[#020617]" href={link.url} key={link.url} rel="noreferrer" target="_blank">
                          <span className="inline-flex items-center gap-2">
                            <Icon size={16} /> {link.label}
                          </span>
                          <ExternalLink size={14} />
                        </a>
                      );
                    })}
                  </div>
                </section>
              </Reveal>
            ) : null}
            <Reveal delay={0.16}>
              <ProjectExplainer project={project} />
            </Reveal>

            {related.length > 0 ? (
              <Reveal delay={0.18}>
                <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950">
                  <h2 className="font-semibold">Related projects</h2>
                  <div className="mt-4 grid gap-3">
                    {related.map((item) => (
                      <Link className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-slate-800 dark:bg-[#020617]" href={`/projects/${item.slug}`} key={item.id}>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{plainText(item.summary)}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              </Reveal>
            ) : null}
          </aside>
        </div>
      </article>
    </main>
  );
}
