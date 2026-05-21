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
      animate={visible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.92, y: 16 }}
      className="fixed bottom-20 right-4 z-40 grid size-12 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-950 shadow-xl shadow-slate-950/10 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 dark:text-white"
      initial={false}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      type="button"
    >
      <svg aria-hidden className="absolute inset-1" viewBox="0 0 44 44">
        <circle
          className="stroke-slate-200 dark:stroke-slate-800"
          cx="22"
          cy="22"
          fill="none"
          r="19"
          strokeWidth="2"
        />
        <motion.circle
          className="stroke-slate-950 dark:stroke-white"
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
      <ArrowUp className="relative size-5" />
    </motion.button>
  );
}
