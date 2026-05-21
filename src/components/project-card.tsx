"use client";

import { ArrowUpRight, Code2, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { mediaUrl } from "@/lib/api";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const imageUrl = mediaUrl(project.thumbnail_url ?? project.og_image_url);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-sm shadow-slate-950/5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-950/10 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-cyan-500/40">
      <Link className="relative block aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-900" href={`/projects/${project.slug}`}>
        {imageUrl ? (
          <Image
            alt={project.title}
            className="object-cover transition duration-500 group-hover:scale-105"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            src={imageUrl}
            unoptimized
          />
        ) : (
          <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_42%)] text-cyan-700 dark:text-cyan-300">
            <ImageIcon className="size-10" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/30 to-transparent" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">{project.title}</h3>
            <p className="mt-2 line-clamp-3 leading-7 text-slate-600 dark:text-slate-300">{plainText(project.summary)}</p>
          </div>
          {project.featured ? (
            <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
              Featured
            </span>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {(project.tech_stack ?? []).slice(0, 6).map((tech) => (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" key={tech}>
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-3 pt-6">
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 hover:text-cyan-900 dark:text-cyan-300 dark:hover:text-cyan-100" href={`/projects/${project.slug}`}>
            Detail <ArrowUpRight size={16} />
          </Link>
          {project.github_url ? (
            <a className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white" href={project.github_url} rel="noreferrer" target="_blank">
              <Code2 size={16} /> GitHub
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function plainText(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
