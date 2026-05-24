"use client";

import { Award, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";

export function HomeCertificateCarousel({
  items,
}: {
  items: { id: number; title: string; issuer: string; imageUrl: string | null; issuedAt: string }[];
}) {
  const reduce = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const repeated = items.length > 1 ? [...items, ...items] : items;

  useEffect(() => {
    if (reduce || items.length <= 1) return;
    let frame = 0;

    function tick() {
      const node = scrollRef.current;
      if (node && !pausedRef.current) {
        const loopPoint = node.scrollWidth / 2;
        node.scrollLeft += 0.45;
        if (node.scrollLeft >= loopPoint) node.scrollLeft = 0;
      }
      frame = window.requestAnimationFrame(tick);
    }

    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    };
  }, [items.length, reduce]);

  if (items.length === 0) return null;

  function pauseAuto() {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
  }

  function resumeAuto(delay = 1200) {
    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = window.setTimeout(() => {
      pausedRef.current = false;
    }, delay);
  }

  function scrollByCard(direction: -1 | 1) {
    pauseAuto();
    scrollRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
    resumeAuto(1800);
  }

  return (
    <div className="relative rounded-[2rem] border border-cyan-200/50 bg-white p-3 shadow-xl shadow-cyan-950/10 dark:bg-slate-950 dark:shadow-cyan-950/20 sm:p-4">
      <div className="mb-3 flex justify-end gap-2">
        <button
          aria-label="Previous certificate"
          className="grid size-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          type="button"
          onClick={() => scrollByCard(-1)}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          aria-label="Next certificate"
          className="grid size-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          type="button"
          onClick={() => scrollByCard(1)}
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <motion.div
        className="cert-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2"
        ref={scrollRef}
        onBlur={() => resumeAuto()}
        onFocus={pauseAuto}
        onMouseEnter={pauseAuto}
        onMouseLeave={() => resumeAuto()}
        onPointerDown={pauseAuto}
        onPointerUp={() => resumeAuto()}
        onTouchEnd={() => resumeAuto()}
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {repeated.map((item, index) => (
          <article className="w-[82vw] max-w-80 shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200 bg-[#f8fafc] text-slate-950 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-white/[0.06] dark:text-white sm:w-80" key={`${item.id}-${index}`}>
            <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-900">
              {item.imageUrl ? (
                <Image alt={item.title} className="object-cover" fill sizes="288px" src={item.imageUrl} />
              ) : (
                <div className="grid h-full place-items-center text-cyan-700 dark:text-cyan-200">
                  <Award className="size-10" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="line-clamp-2 font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.issuer}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-200">{item.issuedAt}</p>
            </div>
          </article>
        ))}
      </motion.div>
    </div>
  );
}
