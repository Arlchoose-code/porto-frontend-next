"use client";

import { Check, Copy, Mail } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="relative">
      <button
        className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        onClick={copyEmail}
        type="button"
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
        Copy email
      </button>
      <AnimatePresence>
        {copied ? (
          <motion.div
            className="absolute -top-12 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-700 shadow-lg dark:border-emerald-900 dark:bg-slate-950 dark:text-emerald-300"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
          >
            <Mail className="size-4" /> Email copied
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
