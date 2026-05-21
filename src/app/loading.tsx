export default function Loading() {
  return (
    <main className="min-h-[60vh] bg-[#f6f9fc] px-4 py-28 dark:bg-[#020617] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="h-8 w-40 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="mt-6 h-14 max-w-2xl animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="mt-4 h-6 max-w-xl animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div className="h-64 animate-pulse rounded-[2rem] bg-slate-200 dark:bg-slate-800" key={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
