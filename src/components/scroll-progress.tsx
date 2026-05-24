"use client";

import { ArrowUp } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useState } from "react";

export function ScrollProgress() {
  const { scrollY, scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.2 });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 220);
  });

  return (
    <motion.button
      aria-label="Scroll to top"
      animate={visible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 14 }}
      className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] z-40 grid size-11 place-items-center rounded-full border border-slate-200/80 bg-white/85 text-slate-950 shadow-lg shadow-slate-950/10 backdrop-blur-xl transition-colors hover:border-teal-300 hover:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/20 sm:right-5 sm:bottom-[calc(env(safe-area-inset-bottom)+6.25rem)] sm:size-12 dark:border-white/10 dark:bg-slate-950/80 dark:text-white dark:shadow-black/30 dark:hover:border-teal-400/60"
      initial={false}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      type="button"
    >
      <span className="absolute inset-1 rounded-full bg-gradient-to-br from-teal-500/10 via-transparent to-cyan-500/10" />
      <svg aria-hidden className="absolute inset-1 size-[calc(100%-0.5rem)]" viewBox="0 0 44 44">
        <circle
          className="stroke-slate-200/90 dark:stroke-white/10"
          cx="22"
          cy="22"
          fill="none"
          r="19"
          strokeWidth="2"
        />
        <motion.circle
          className="stroke-teal-600 dark:stroke-teal-300"
          cx="22"
          cy="22"
          fill="none"
          pathLength={1}
          r="19"
          strokeDasharray="1"
          strokeLinecap="round"
          strokeWidth="2.5"
          style={{ pathLength, rotate: -90, transformOrigin: "center" }}
        />
      </svg>
      <ArrowUp className="relative size-4.5 sm:size-5" />
    </motion.button>
  );
}
