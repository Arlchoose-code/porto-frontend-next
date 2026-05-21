import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-8 max-w-3xl">
          {eyebrow ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-300">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">{title}</h2>
          {description ? <p className="mt-3 text-lg leading-8 text-slate-600 dark:text-slate-300">{description}</p> : null}
        </Reveal>
        <Reveal>{children}</Reveal>
      </div>
    </section>
  );
}
