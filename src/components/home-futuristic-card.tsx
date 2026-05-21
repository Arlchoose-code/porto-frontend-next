"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function HomeFuturisticCard({
  children,
  className = "",
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-3xl border border-cyan-200/40 bg-white/80 shadow-sm shadow-cyan-950/5 backdrop-blur dark:border-cyan-400/15 dark:bg-slate-950/70 dark:shadow-cyan-950/20 ${className}`}
      initial={reduce ? false : { opacity: 0, y: 28, scale: 0.97 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.48, ease: "easeOut", delay: Math.min(index * 0.05, 0.22) }}
      whileHover={reduce ? undefined : { y: -8, rotateX: 1.5, rotateY: -1.5 }}
    >
      <motion.span
        aria-hidden
        className="absolute -right-10 -top-10 size-24 rounded-full border border-cyan-300/30 opacity-60 dark:border-cyan-300/20"
        animate={reduce ? undefined : { scale: [1, 1.18, 1], opacity: [0.25, 0.7, 0.25] }}
        transition={{ duration: 4.5 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        aria-hidden
        className="absolute bottom-3 right-3 size-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.9)]"
        animate={reduce ? undefined : { scale: [1, 1.8, 1], opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 2.4 + index * 0.15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-cyan-400/70 opacity-0 group-hover:opacity-100"
        animate={reduce ? undefined : { x: ["-100%", "100%"] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
