"use client";

import { ArrowLeft, Bot, Clock, Code2, ExternalLink, ImageIcon, Layers3, Loader2, RadioTower, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MdxRenderer } from "@/components/mdx-renderer";
import { formatLongDate, plainText } from "@/lib/format";

type PreviewResource = "blogs" | "projects";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

type PreviewRecord = {
  id: number;
  title?: string;
  slug?: string;
  status?: string;
  summary?: string;
  content?: string;
  description?: string;
  thumbnail_url?: string | null;
  og_image_url?: string | null;
  tags?: string[] | null;
  tech_stack?: string[] | null;
  author_display_name?: string;
  published_at?: string | null;
  created_at?: string;
  github_url?: string | null;
  live_url?: string | null;
  huggingface_url?: string | null;
};

export function AdminPublicPreview({
  resource,
  id,
}: {
  resource: PreviewResource;
  id: string;
}) {
  const [item, setItem] = useState<PreviewRecord | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const token = window.localStorage.getItem("admin_access_token") ?? "";

    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/admin/${resource}?limit=500`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        const body = (await response.json().catch(() => null)) as ApiResponse<PreviewRecord[]> | null;
        if (!response.ok || !body?.success) throw new Error(body?.message ?? "Preview failed");
        const found = (body.data ?? []).find((record) => String(record.id) === id);
        if (!found) throw new Error("Draft not found in admin data.");
        if (!cancelled) setItem(found);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Preview failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [resource, id]);

  const publicHref = useMemo(() => {
    if (!item?.slug || item.status === "draft") return "";
    return resource === "blogs" ? `/blog/${item.slug}` : `/projects/${item.slug}`;
  }, [item, resource]);

  if (loading) {
    return (
      <section className="grid min-h-[60vh] place-items-center">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <Loader2 className="size-4 animate-spin text-teal-600" />
          Loading admin preview
        </div>
      </section>
    );
  }

  if (error || !item) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100">
        <h1 className="text-2xl font-semibold">Preview unavailable</h1>
        <p className="mt-2 text-sm">{error || "Record not found."}</p>
        <Link className="mt-5 inline-flex rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white" href={`/admin/${resource}`}>
          Back to {resource}
        </Link>
      </section>
    );
  }

  const title = item.title || "Untitled";
  const image = mediaUrl(item.thumbnail_url ?? item.og_image_url);

  if (resource === "blogs") {
    return <BlogDraftPreview image={image} item={item} publicHref={publicHref} title={title} />;
  }

  return <ProjectDraftPreview image={image} item={item} publicHref={publicHref} title={title} />;
}

function PreviewBar({
  resource,
  status,
  publicHref,
}: {
  resource: PreviewResource;
  status?: string;
  publicHref: string;
}) {
  return (
    <div className="border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white" href={`/admin/${resource}`}>
          <ArrowLeft className="size-4" />
          Back to admin
        </Link>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
            {status === "draft" ? "Draft preview" : "Admin preview"}
          </span>
          {publicHref ? (
            <Link className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold dark:border-slate-800 dark:bg-slate-950" href={publicHref} target="_blank">
              <ExternalLink className="size-3.5" />
              Public page
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function BlogDraftPreview({
  item,
  image,
  publicHref,
  title,
}: {
  item: PreviewRecord;
  image: string | null;
  publicHref: string;
  title: string;
}) {
  const content = item.content || item.summary;

  return (
    <main className="bg-[#f6f9fc] text-slate-950 dark:bg-[#020617] dark:text-white">
      <PreviewBar publicHref={publicHref} resource="blogs" status={item.status} />
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_45%,#f5f3ff_100%)] pt-16 dark:bg-[linear-gradient(135deg,#020617_0%,#071826_52%,#160f2a_100%)] sm:pt-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.055)_1px,transparent_1px)]" />
        <div className="absolute left-[-4rem] top-24 size-72 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-400/12" />
        <div className="absolute right-[-5rem] bottom-[-5rem] size-80 rounded-full bg-fuchsia-300/20 blur-3xl dark:bg-fuchsia-500/12" />
        <div className="relative mx-auto max-w-5xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-sm font-semibold text-cyan-800 shadow-sm backdrop-blur dark:border-cyan-400/20 dark:bg-slate-950/70 dark:text-cyan-200">
              <Bot className="size-4" />
              Article preview
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">{plainText(item.summary)}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-950/70">
                <Clock className="size-4" />
                {formatLongDate(item.published_at ?? item.created_at)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-950/70">
                <UserRound className="size-4" />
                {item.author_display_name || "Syahril Haryono"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <article className="relative border-t border-slate-200 py-16 dark:border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(168,85,247,0.1),transparent_24%)]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900">
            {image ? (
              <Image alt={title} className="object-cover" fill sizes="(min-width: 1024px) 1024px, 100vw" src={image} unoptimized />
            ) : (
              <div className="grid h-full min-h-72 place-items-center text-slate-400">
                <ImageIcon className="size-12" />
              </div>
            )}
          </div>

          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950 sm:p-8">
            <MdxRenderer content={content} />
          </div>

          {(item.tags ?? []).length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {(item.tags ?? []).map((tag) => (
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </main>
  );
}

function ProjectDraftPreview({
  item,
  image,
  publicHref,
  title,
}: {
  item: PreviewRecord;
  image: string | null;
  publicHref: string;
  title: string;
}) {
  const links = [
    item.github_url ? { label: "GitHub", url: item.github_url, icon: Code2 } : null,
    item.live_url ? { label: "Live", url: item.live_url, icon: ExternalLink } : null,
    item.huggingface_url ? { label: "HuggingFace", url: item.huggingface_url, icon: ExternalLink } : null,
  ].filter(Boolean);

  return (
    <main className="bg-[#f6f9fc] text-slate-950 dark:bg-[#020617] dark:text-white">
      <PreviewBar publicHref={publicHref} resource="projects" status={item.status} />
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_45%,#f5f3ff_100%)] pt-16 dark:bg-[linear-gradient(135deg,#020617_0%,#071826_52%,#160f2a_100%)] sm:pt-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.055)_1px,transparent_1px)]" />
        <div className="absolute left-[-4rem] top-24 size-72 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-400/12" />
        <div className="absolute right-[-5rem] bottom-[-5rem] size-80 rounded-full bg-fuchsia-300/20 blur-3xl dark:bg-fuchsia-500/12" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-sm font-semibold text-cyan-800 shadow-sm backdrop-blur dark:border-cyan-400/20 dark:bg-slate-950/70 dark:text-cyan-200">
                <Layers3 className="size-4" />
                Project preview
              </p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">{plainText(item.summary)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06]">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                <RadioTower className="size-4" />
                Status
              </p>
              <p className="mt-2 text-2xl font-semibold capitalize">{item.status || "draft"}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Stack and external links are available below.</p>
            </div>
          </div>
        </div>
      </section>

      <article className="relative border-t border-slate-200 py-16 dark:border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(16,185,129,0.1),transparent_24%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          <div className="min-w-0">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900">
              {image ? (
                <Image alt={title} className="object-cover" fill sizes="(min-width: 1024px) 820px, 100vw" src={image} unoptimized />
              ) : (
                <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_42%)] text-cyan-700 dark:text-cyan-300">
                  <ImageIcon className="size-12" />
                </div>
              )}
            </div>

            <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950 sm:p-8">
              <MdxRenderer content={item.description || item.summary} />
            </div>
          </div>

          <aside className="grid h-fit gap-4 lg:sticky lg:top-24">
            <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950">
              <h2 className="font-semibold">Tech stack</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {(item.tech_stack ?? []).length ? (
                  (item.tech_stack ?? []).map((tech) => (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200" key={tech}>
                      {tech}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No stack listed.</p>
                )}
              </div>
            </section>

            {links.length > 0 ? (
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
            ) : null}
          </aside>
        </div>
      </article>
    </main>
  );
}

function mediaUrl(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const uploadIndex = normalized.indexOf("/uploads/");
  if (uploadIndex >= 0) return `/api/asset?path=${encodeURIComponent(normalized.slice(uploadIndex))}`;
  return normalized;
}
