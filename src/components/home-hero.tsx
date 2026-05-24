"use client";

import { Activity, ArrowRight, BrainCircuit, Code2, Cpu, Download, Mail, Network, Sparkles, Terminal } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Profile } from "@/lib/types";

export function HomeHero({
  profile,
  avatarUrl,
  projectCount,
  blogCount,
  skillCount,
}: {
  profile: Profile;
  avatarUrl: string | null;
  projectCount: number;
  blogCount: number;
  skillCount: number;
}) {
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);
  const stats = [
    ["Projects", projectCount],
    ["Articles", blogCount],
    ["Skills", skillCount],
  ];

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[#f8fafc] dark:border-slate-800 dark:bg-[#020617]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:52px_52px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.11)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)]" />
      <motion.div
        aria-hidden
        className="absolute left-0 top-24 h-px w-full bg-cyan-400/40 dark:bg-cyan-300/35"
        animate={reduce ? undefined : { x: ["-100%", "100%"], opacity: [0, 1, 0] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-28 left-0 h-px w-full bg-emerald-400/35 dark:bg-emerald-300/30"
        animate={reduce ? undefined : { x: ["100%", "-100%"], opacity: [0, 1, 0] }}
        transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-950" />
      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.86fr)] lg:px-8 lg:py-20">
        <motion.div
          className="flex flex-col justify-center"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <motion.div
            className="mb-6 flex flex-wrap items-center gap-3"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
          >
            {profile.open_to_work ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:shadow-black/10">
                <span className="size-2 rounded-full bg-emerald-500" />
                Open to {profile.work_type} work
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:shadow-black/10">
              <Sparkles size={15} /> AI-focused full stack
            </span>
          </motion.div>

          <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-800 dark:border-cyan-900/70 dark:bg-cyan-950/40 dark:text-cyan-200">
            <Cpu size={15} /> AI Engineer Portfolio
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
            {profile.site_name}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-9 text-slate-700 dark:text-slate-200">
            {profile.tagline || "Full Stack Developer focused on AI-powered web products."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-5 font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950" href="/projects">
              View projects <ArrowRight size={18} />
            </Link>
            {profile.resume_url ? (
              <a className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 font-semibold text-slate-950 shadow-sm shadow-slate-200/50 transition hover:-translate-y-0.5 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:shadow-black/10" href={profile.resume_url}>
                <Download size={18} /> Resume
              </a>
            ) : null}
          </div>

          <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
            {profile.email ? <a className="inline-flex items-center gap-2 hover:text-slate-950 dark:hover:text-white" href={`mailto:${profile.email}`}><Mail size={17} /> {profile.email}</a> : null}
            {profile.github_url ? <a className="inline-flex items-center gap-2 hover:text-slate-950 dark:hover:text-white" href={profile.github_url} rel="noreferrer" target="_blank"><Code2 size={17} /> GitHub</a> : null}
            {profile.linkedin_url ? <a className="inline-flex items-center gap-2 hover:text-slate-950 dark:hover:text-white" href={profile.linkedin_url} rel="noreferrer" target="_blank"><Network size={17} /> LinkedIn</a> : null}
          </div>

          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["LLM apps", BrainCircuit],
              ["API systems", Terminal],
              ["Fast UI", Activity],
            ].map(([label, Icon], index) => {
              const TypedIcon = Icon as typeof BrainCircuit;
              return (
                <motion.div
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-3 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/50 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200 dark:shadow-black/10"
                  animate={reduce ? undefined : { y: [0, index % 2 ? 6 : -6, 0] }}
                  transition={{ duration: 4.8 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
                  key={label as string}
                >
                  <TypedIcon className="size-4 text-cyan-700 dark:text-cyan-300" />
                  {label as string}
                </motion.div>
              );
            })}
          </div>

          <motion.div
            className="mt-10 grid max-w-xl grid-cols-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/10"
            animate={reduce ? undefined : { y: [0, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {stats.map(([label, value]) => (
              <div className="border-r border-slate-200 px-4 py-4 last:border-r-0 dark:border-slate-800" key={label}>
                <p className="text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
                <p className="mt-1 text-xs font-medium uppercase text-slate-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="grid content-center gap-4"
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
            mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
          }}
          onMouseLeave={() => {
            mouseX.set(0);
            mouseY.set(0);
          }}
        >
          <div className="relative mx-auto grid w-full max-w-md gap-4 lg:max-w-none lg:grid-cols-[1fr_86px]">
            {[
              "left-2 top-8 bg-cyan-500",
              "right-24 top-2 bg-emerald-500",
              "bottom-20 right-2 bg-amber-500",
            ].map((className, index) => (
              <motion.span
                aria-hidden
                className={`absolute hidden size-2 rounded-full shadow-lg lg:block ${className}`}
                animate={reduce ? undefined : { opacity: [0.35, 1, 0.35], scale: [1, 1.6, 1] }}
                transition={{ duration: 2.6 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
                key={className}
              />
            ))}
            <motion.div
              className="absolute -left-4 top-16 hidden h-28 w-1 rounded-full bg-cyan-500 lg:block dark:bg-cyan-300"
              animate={reduce ? undefined : { y: [0, 18, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-2xl shadow-slate-950/12 dark:border-slate-800 dark:bg-slate-900 dark:shadow-cyan-950/30"
              animate={reduce ? undefined : { y: [0, -10, 0], rotate: [0, -0.4, 0] }}
              style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="relative aspect-[4/5]">
                <motion.div
                  aria-hidden
                  className="absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-cyan-400/25 to-transparent mix-blend-screen"
                  animate={reduce ? undefined : { y: ["-30%", "440%"], opacity: [0, 0.85, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                />
                {avatarUrl ? (
                  <Image
                    alt={profile.site_name || "Syahril Haryono"}
                    className="object-cover"
                    fill
                    priority
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    src={avatarUrl}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-7xl font-semibold text-slate-500">
                    SH
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                {["Go", "Next.js", "AI"].map((item) => (
                  <span className="border-r border-slate-200 px-3 py-3 text-center text-xs font-semibold text-slate-600 last:border-r-0 dark:border-slate-800 dark:text-slate-300" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
            <div className="hidden gap-3 lg:grid">
              {["API", "CMS", "SEO", "RAG"].map((item, index) => (
                <motion.div
                  className="grid place-items-center rounded-2xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:shadow-black/10"
                  animate={reduce ? undefined : { y: [0, index % 2 === 0 ? -12 : 10, 0] }}
                  transition={{ duration: 5.4 + index * 0.35, repeat: Infinity, ease: "easeInOut" }}
                  key={item}
                >
                  {item}
                </motion.div>
              ))}
            </div>
            <motion.div
              className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-cyan-200/70 bg-white/95 p-4 shadow-xl shadow-cyan-950/10 backdrop-blur dark:border-cyan-900/70 dark:bg-slate-950/95"
              animate={reduce ? undefined : { y: [0, -12, 0] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-xs font-semibold uppercase text-teal-700 dark:text-teal-300">Working on</p>
              <p className="mt-1 line-clamp-2 text-sm font-medium leading-6 text-slate-900 dark:text-slate-100">{profile.working_on ?? "AI-powered portfolio systems"}</p>
            </motion.div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <MiniPanel label="Learning" value={profile.currently_learning ?? "AI engineering, Go, and scalable web architecture"} />
            <MiniPanel label="Focus" value="Web products, backend APIs, and useful AI workflows" />
          </div>

          <motion.div
            className="rounded-2xl border border-slate-200 bg-white p-4 font-mono text-xs text-slate-700 shadow-xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950 dark:text-cyan-100"
            animate={reduce ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="mb-3 flex gap-1.5">
              <span className="size-2 rounded-full bg-rose-400" />
              <span className="size-2 rounded-full bg-amber-400" />
              <span className="size-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-cyan-700 dark:text-cyan-300">&gt; boot portfolio-agent</p>
            <p className="mt-1 text-slate-700 dark:text-slate-300">context: profile + projects + skills</p>
            <p className="mt-1 text-emerald-700 dark:text-emerald-300">status: ready_for_collaboration</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function MiniPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm shadow-slate-200/50 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-black/10">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}
