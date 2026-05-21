"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Award, BrainCircuit, BriefcaseBusiness, GraduationCap, Layers3, Mail, PenLine, Sparkles, Workflow } from "lucide-react";
import type { ReactNode } from "react";

const icons = {
  award: Award,
  brain: BrainCircuit,
  briefcase: BriefcaseBusiness,
  graduation: GraduationCap,
  layers: Layers3,
  mail: Mail,
  pen: PenLine,
  sparkles: Sparkles,
  workflow: Workflow,
};

export function HomeSectionHeading({
  eyebrow,
  title,
  children,
  icon,
  inverted = false,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  icon: keyof typeof icons;
  inverted?: boolean;
}) {
  const reduce = useReducedMotion();
  const Icon = icons[icon];

  return (
    <motion.div
      className="max-w-3xl"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-800 shadow-sm shadow-cyan-950/5 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200">
        <Icon className="size-4" />
        {eyebrow}
      </div>
      <h2 className={`text-3xl font-semibold tracking-tight sm:text-5xl ${inverted ? "text-white" : "text-slate-950 dark:text-white"}`}>{title}</h2>
      {children ? <div className={`mt-4 text-lg leading-8 ${inverted ? "text-slate-300" : "text-slate-600 dark:text-slate-300"}`}>{children}</div> : null}
    </motion.div>
  );
}
