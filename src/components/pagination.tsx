import Link from "next/link";
import type { ApiMeta } from "@/lib/types";

export function Pagination({
  meta,
  searchParams,
}: {
  meta?: ApiMeta;
  searchParams: Record<string, string | undefined>;
}) {
  const page = meta?.page ?? 1;
  const totalPages = meta?.total_pages ?? 0;
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm shadow-slate-200/50 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/10">
      <p className="text-slate-600 dark:text-slate-300">
        Page <span className="font-semibold text-slate-950 dark:text-white">{page}</span> of{" "}
        <span className="font-semibold text-slate-950 dark:text-white">{totalPages}</span>
      </p>
      <div className="flex gap-2">
        <PageLink disabled={page <= 1} page={page - 1} searchParams={searchParams}>
          Previous
        </PageLink>
        <PageLink disabled={page >= totalPages} page={page + 1} searchParams={searchParams}>
          Next
        </PageLink>
      </div>
    </nav>
  );
}

function PageLink({
  children,
  disabled,
  page,
  searchParams,
}: {
  children: React.ReactNode;
  disabled: boolean;
  page: number;
  searchParams: Record<string, string | undefined>;
}) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  params.set("page", String(page));

  if (disabled) {
    return (
      <span className="inline-flex h-10 items-center rounded-full border border-slate-200 px-4 font-semibold text-slate-400 dark:border-slate-800">
        {children}
      </span>
    );
  }

  return (
    <Link className="inline-flex h-10 items-center rounded-full border border-slate-200 px-4 font-semibold transition hover:border-teal-400 dark:border-slate-800" href={`?${params.toString()}`}>
      {children}
    </Link>
  );
}
