"use client";

import { Bot, MessageSquareText, Sparkles, WandSparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const prompts = [
  "Jelaskan profil Syahril secara singkat",
  "Project AI apa saja yang paling menarik?",
  "Skill backend dan AI/ML Syahril apa saja?",
  "Bagaimana cara menghubungi Syahril?",
];

export function HomeCommandCenter() {
  const reduce = useReducedMotion();

  function ask(prompt: string) {
    window.dispatchEvent(new CustomEvent("portfolio-ai-prompt", { detail: prompt }));
  }

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white py-20 text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.07)_1px,transparent_1px)] bg-[size:58px_58px]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -24 }}
          whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
            <Bot className="size-4" /> AI Command Center
          </div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">Ask the portfolio like an assistant</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Quick prompts connect directly to the floating AI chat, so visitors can explore profile, projects, skills, and contact paths faster.
          </p>
        </motion.div>

        <motion.div
          className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-xl shadow-slate-950/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:shadow-cyan-950/30"
          initial={reduce ? false : { opacity: 0, y: 28, scale: 0.97 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 dark:border-white/10 dark:bg-slate-950/70">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 dark:text-cyan-100">
              <MessageSquareText className="size-4" /> Prompt router
            </span>
            <WandSparkles className="size-4 text-cyan-300" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {prompts.map((prompt, index) => (
              <motion.button
                className="group rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm font-semibold leading-6 text-slate-700 transition hover:border-cyan-300/50 hover:bg-cyan-50 dark:border-white/10 dark:bg-white/[0.07] dark:text-slate-100 dark:hover:bg-cyan-300/10"
                key={prompt}
                onClick={() => ask(prompt)}
                type="button"
                whileHover={reduce ? undefined : { y: -4 }}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
              >
                <Sparkles className="mb-3 size-4 text-cyan-300 transition group-hover:rotate-12" />
                {prompt}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
