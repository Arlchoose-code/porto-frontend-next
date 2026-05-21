"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AboutMotionField() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute left-[8%] top-[18%] size-56 rounded-full border border-cyan-300/15"
        animate={reduce ? undefined : { rotate: 360, scale: [1, 1.06, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute right-[10%] top-[22%] size-40 rounded-full border border-fuchsia-300/15"
        animate={reduce ? undefined : { rotate: -360, y: [0, 14, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[18%] left-[38%] h-px w-52 bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent"
        animate={reduce ? undefined : { x: [-80, 80, -80], opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      {[0, 1, 2, 3, 4].map((item) => (
        <motion.span
          className="absolute size-1.5 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.9)]"
          key={item}
          style={{ left: `${18 + item * 15}%`, top: `${32 + (item % 2) * 28}%` }}
          animate={reduce ? undefined : { y: [0, -18, 0], opacity: [0.25, 1, 0.25], scale: [1, 1.5, 1] }}
          transition={{ duration: 3.2 + item * 0.35, repeat: Infinity, ease: "easeInOut", delay: item * 0.2 }}
        />
      ))}
    </div>
  );
}
