import { formatDate } from "@/lib/format";

export function TimelineItem({
  title,
  subtitle,
  description,
  start,
  end,
  current,
}: {
  title: string;
  subtitle: string;
  description?: string | null;
  start: string;
  end?: string | null;
  current?: boolean;
}) {
  return (
    <article className="relative border-l border-slate-200 pb-8 pl-6 last:pb-0 dark:border-slate-800">
      <span className="absolute -left-1.5 top-1 size-3 rounded-full bg-cyan-600 ring-4 ring-white dark:ring-slate-950" />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {formatDate(start)} - {current ? "Present" : formatDate(end)}
      </p>
      <h3 className="mt-1 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 font-medium text-slate-700 dark:text-slate-200">{subtitle}</p>
      {description ? <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{description}</p> : null}
    </article>
  );
}
