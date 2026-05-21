"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [transition, setTransition] = useState<null | { x: number; y: number; nextDark: boolean }>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextDark = stored ? stored === "dark" : systemDark;
    document.documentElement.classList.toggle("dark", nextDark);
    requestAnimationFrame(() => {
      setIsDark(nextDark);
      setMounted(true);
    });
  }, []);

  function toggleTheme(event: React.MouseEvent<HTMLButtonElement>) {
    const nextDark = !isDark;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    setTransition({ x, y, nextDark });
    window.setTimeout(() => {
      document.documentElement.classList.toggle("dark", nextDark);
      localStorage.setItem("theme", nextDark ? "dark" : "light");
      setIsDark(nextDark);
    }, 160);
    window.setTimeout(() => setTransition(null), 720);
  }

  return (
    <>
      <button
        aria-label="Toggle theme"
        className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        type="button"
        onClick={toggleTheme}
        suppressHydrationWarning
      >
        {mounted && isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <AnimatePresence>
        {transition ? (
          <motion.div
            aria-hidden
            className="fixed inset-0 z-[100] pointer-events-none"
            initial={{
              clipPath: `circle(0px at ${transition.x}px ${transition.y}px)`,
              opacity: 0.95,
            }}
            animate={{
              clipPath: `circle(160vmax at ${transition.x}px ${transition.y}px)`,
              opacity: [0.95, 1, 0],
            }}
            exit={{ opacity: 0 }}
            style={{ background: transition.nextDark ? "#020617" : "#f8fafc" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
