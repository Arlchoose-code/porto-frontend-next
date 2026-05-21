"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function BlogReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return <motion.div className="fixed left-0 right-0 top-16 z-[70] h-1 origin-left bg-cyan-400" style={{ scaleX }} />;
}

export function BlogTableOfContents({ items }: { items: { id: string; text: string }[] }) {
  if (!items.length) return null;

  function scrollToHeading(id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <nav className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Contents</p>
      <div className="mt-4 grid gap-2">
        {items.map((item) => (
          <button
            className="text-left text-sm font-medium leading-6 text-slate-600 transition hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-200"
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            type="button"
          >
            {item.text}
          </button>
        ))}
      </div>
    </nav>
  );
}
