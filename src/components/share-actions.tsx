"use client";

import { Check, Copy, MessageCircle, Share2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function ShareActions({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setOpen(false);
    window.setTimeout(() => setCopied(false), 1400);
  }

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        type="button"
        onClick={() => {
          const rect = buttonRef.current?.getBoundingClientRect();
          if (rect) {
            setPosition({
              left: Math.min(rect.left, window.innerWidth - 240),
              top: rect.bottom + 8,
            });
          }
          setOpen((value) => !value);
        }}
      >
        <Share2 className="size-4" />
        Share link
      </button>
      {open && typeof document !== "undefined" ? createPortal(
        <>
          <button aria-label="Close share menu" className="fixed inset-0 z-[90] cursor-default bg-transparent" type="button" onClick={() => setOpen(false)} />
          <div
            className="fixed z-[100] w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-950/20 dark:border-slate-800 dark:bg-slate-950"
            style={position}
          >
          <button className="flex h-10 w-full items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" type="button" onClick={copy}>
            {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy link"}
          </button>
          <a className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`} rel="noreferrer" target="_blank" onClick={() => setOpen(false)}>
            <Share2 className="size-4" />
            LinkedIn
          </a>
          <a className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} rel="noreferrer" target="_blank" onClick={() => setOpen(false)}>
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
          <a className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900" href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} rel="noreferrer" target="_blank" onClick={() => setOpen(false)}>
            <X className="size-4" />
            X
          </a>
          </div>
        </>,
        document.body,
      ) : null}
    </div>
  );
}
