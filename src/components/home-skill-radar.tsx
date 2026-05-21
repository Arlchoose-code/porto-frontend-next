"use client";

import { Radar } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export function HomeSkillRadar({ groups }: { groups: { category: string; count: number }[] }) {
  const reduce = useReducedMotion();
  const max = Math.max(...groups.map((group) => group.count), 1);

  return (
    <motion.div
      className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-cyan-200 bg-white p-6 text-slate-950 shadow-xl shadow-cyan-950/10 dark:border-cyan-300/15 dark:bg-slate-950 dark:text-white dark:shadow-cyan-950/25"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_38%),linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:auto,44px_44px,44px_44px] dark:bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_38%),linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)]" />
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 size-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/20"
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 dark:text-cyan-200">
            <Radar className="size-4" /> Capability radar
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">Skill density</h3>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">{groups.length} groups</span>
      </div>
      <div className="relative mt-8 space-y-4">
        {groups.map((group, index) => {
          const width = `${Math.max((group.count / max) * 100, 16)}%`;
          return (
            <div key={group.category}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-800 dark:text-slate-100">{group.category}</span>
                <span className="text-cyan-700 dark:text-cyan-200">{group.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-fuchsia-300"
                  initial={reduce ? false : { width: 0 }}
                  whileInView={reduce ? undefined : { width }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.06, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
