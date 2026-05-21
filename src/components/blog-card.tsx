"use client";

import { Clock, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { mediaUrl } from "@/lib/api";
import { formatLongDate } from "@/lib/format";
import type { Blog } from "@/lib/types";

export function BlogCard({ blog }: { blog: Blog }) {
  const imageUrl = mediaUrl(blog.thumbnail_url ?? blog.og_image_url);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-sm shadow-slate-950/5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-950/10 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-cyan-500/40">
      <Link className="relative block aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-900" href={`/blog/${blog.slug}`}>
        {imageUrl ? (
          <Image
            alt={blog.title}
            className="object-cover transition duration-500 group-hover:scale-105"
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
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
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{formatLongDate(blog.published_at ?? blog.created_at)}</span>
          <span aria-hidden>&bull;</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={14} /> {blog.reading_time || 1} min read
          </span>
          {blog.author_type === "ai" ? (
            <span className="rounded-full bg-teal-100 px-2.5 py-1 font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-200">
              AI Generated
            </span>
          ) : null}
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
          <Link className="hover:underline" href={`/blog/${blog.slug}`}>
            {blog.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 leading-7 text-slate-600 dark:text-slate-300">{plainText(blog.summary)}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          {(blog.tags ?? []).slice(0, 4).map((tag) => (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function plainText(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
