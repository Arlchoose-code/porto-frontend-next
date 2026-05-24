"use client";

import { ArrowUpRight, Code2, Rocket } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function HomeProjectSpotlight({
  title,
  slug,
  summary,
  imageUrl,
  techStack,
  githubUrl,
  liveUrl,
}: {
  title: string;
  slug: string;
  summary: string;
  imageUrl: string | null;
  techStack: string[];
  githubUrl: string | null;
  liveUrl: string | null;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className="mb-6 overflow-hidden rounded-[2rem] border border-cyan-200/60 bg-white text-slate-950 shadow-xl shadow-cyan-950/10 dark:bg-slate-950 dark:text-white dark:shadow-2xl dark:shadow-cyan-950/20"
      initial={reduce ? false : { opacity: 0, y: 32, scale: 0.97 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-72 overflow-hidden bg-slate-100 dark:bg-slate-900">
          {imageUrl ? (
            <Image alt={title} className="object-cover opacity-90" fill sizes="(min-width: 1024px) 52vw, 100vw" src={imageUrl} />
          ) : (
            <div className="grid h-full place-items-center text-cyan-700 dark:text-cyan-200">
              <Rocket className="size-16" />
            </div>
          )}
          <motion.div
            aria-hidden
            className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent"
            animate={reduce ? undefined : { x: ["-120%", "760%"] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
            <Rocket className="size-4" /> Featured spotlight
          </div>
          <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h3>
          <p className="mt-4 line-clamp-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {techStack.slice(0, 8).map((tech) => (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-100" key={tech}>
                {tech}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950" href={`/projects/${slug}`}>
              View detail <ArrowUpRight size={16} />
            </Link>
            {liveUrl ? (
              <a className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-white/15 dark:text-white dark:hover:bg-white/10" href={liveUrl} rel="noreferrer" target="_blank">
                Live site <ArrowUpRight size={16} />
              </a>
            ) : null}
            {githubUrl ? (
              <a className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-white/15 dark:text-white dark:hover:bg-white/10" href={githubUrl} rel="noreferrer" target="_blank">
                <Code2 size={16} /> GitHub
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
