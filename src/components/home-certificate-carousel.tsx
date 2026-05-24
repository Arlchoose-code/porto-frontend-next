"use client";

import { Award } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

export function HomeCertificateCarousel({
  items,
}: {
  items: { id: number; title: string; issuer: string; imageUrl: string | null; issuedAt: string }[];
}) {
  const reduce = useReducedMotion();
  const repeated = items.length > 0 ? [...items, ...items, ...items] : [];
  const itemWidth = 288;
  const gap = 16;
  const loopWidth = items.length * (itemWidth + gap);

  if (items.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-[2rem] border border-cyan-200/50 bg-white p-4 shadow-xl shadow-cyan-950/10 dark:bg-slate-950 dark:shadow-cyan-950/20">
      <motion.div
        className="flex w-max gap-4"
        animate={reduce ? undefined : { x: [0, -loopWidth] }}
        transition={{ duration: Math.max(items.length * 5, 22), repeat: Infinity, ease: "linear" }}
      >
        {repeated.map((item, index) => (
          <article className="w-72 overflow-hidden rounded-2xl border border-slate-200 bg-[#f8fafc] text-slate-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-white" key={`${item.id}-${index}`}>
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
