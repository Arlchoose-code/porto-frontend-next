import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-[#f6f9fc] px-4 py-28 text-slate-950 dark:bg-[#020617] dark:text-white">
      <section className="max-w-xl text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-cyan-50 text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-200">
          <SearchX className="size-8" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
          The page may have moved, been unpublished, or the URL is incorrect.
        </p>
        <Link className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-5 font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950" href="/">
          <ArrowLeft className="size-4" />
          Back home
        </Link>
      </section>
    </main>
  );
}
