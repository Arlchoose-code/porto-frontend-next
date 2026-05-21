"use client";

import { Code2, Database, FileSearch, Globe2, Sparkles, Workflow } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const items = [
  { label: "Backend API", icon: Database },
  { label: "CMS Workflow", icon: Workflow },
  { label: "AI Assistant", icon: Sparkles },
  { label: "SEO Ready", icon: FileSearch },
  { label: "Public Pages", icon: Globe2 },
  { label: "Developer Tools", icon: Code2 },
];

export function HomeMotionBand() {
  const reduce = useReducedMotion();
  const repeated = [...items, ...items];

  return (
    <section className="border-b border-slate-200 bg-white py-5 text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex w-max gap-3"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        >
          {repeated.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                className="inline-flex h-12 min-w-44 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-[#f8fafc] px-5 text-sm font-semibold text-slate-700 shadow-sm shadow-cyan-950/5 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100 dark:shadow-cyan-950/20"
                key={`${item.label}-${index}`}
              >
                <Icon className="size-4 text-cyan-300" />
                {item.label}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
