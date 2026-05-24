import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  Download,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { AboutMotionField } from "@/components/about-motion-field";
import { MdxRenderer } from "@/components/mdx-renderer";
import { Reveal } from "@/components/reveal";
import { SkillIcon } from "@/components/skill-icon";
import {
  getCertificates,
  getEducations,
  getExperiences,
  getProfile,
  getSEOSettings,
  getSkills,
  mediaUrl,
} from "@/lib/api";
import { formatDate, formatLongDate, groupBy, plainText } from "@/lib/format";
import { metadataFromSEOPage, profileSeoImage, webPageJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [profile, seo] = await Promise.all([getProfile(), getSEOSettings()]);
  const title = `About ${profile.site_name || "Syahril Haryono"}`;
  const description = plainText(profile.site_description || profile.bio || profile.tagline).slice(0, 155);

  return metadataFromSEOPage(seo, "about", {
    title,
    description,
    path: "/about",
    image: profileSeoImage(profile),
    keywords: profile.site_keywords?.split(",").map((item) => item.trim()).filter(Boolean),
  });
}

export default async function AboutPage({
  searchParams,
}: {
  searchParams?: Promise<{ certificate_search?: string; certificate_page?: string }>;
}) {
  const params = await searchParams;
  const certificateSearch = params?.certificate_search?.trim() ?? "";
  const certificatePage = Math.max(1, Number(params?.certificate_page ?? 1) || 1);
  const [profile, skills, experiences, educations, certificates] = await Promise.all([
    getProfile(),
    getSkills(),
    getExperiences(),
    getEducations(),
    getCertificates({ page: certificatePage, limit: 6, search: certificateSearch }),
  ]);

  const groups = groupBy(skills, (skill) => skill.category || "Other");
  const avatarUrl = mediaUrl(profile.avatar_url ?? profile.logo_url ?? profile.og_image_url);
  const statusText = profile.open_to_work ? `Open to ${labelize(profile.work_type)} work` : "Available for selected collaboration";
  const seo = await getSEOSettings();
  const pageJsonLd = seo?.pages.about ? webPageJsonLd(seo.pages.about, seo) : null;

  return (
    <main className="bg-[#f6f9fc] text-slate-950 dark:bg-[#020617] dark:text-white">
      {pageJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} /> : null}
      <section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_45%,#f5f3ff_100%)] pt-24 text-slate-950 dark:border-slate-800 dark:bg-[linear-gradient(135deg,#020617_0%,#071826_52%,#160f2a_100%)] dark:text-white sm:pt-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:58px_58px] dark:bg-[linear-gradient(to_right,rgba(34,211,238,0.075)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]" />
        <div className="absolute left-[-6rem] top-20 size-72 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-400/14" />
        <div className="absolute right-[-4rem] bottom-[-6rem] size-80 rounded-full bg-fuchsia-300/20 blur-3xl dark:bg-fuchsia-500/12" />
        <AboutMotionField />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-sm font-semibold text-cyan-800 shadow-sm backdrop-blur dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
                  <Sparkles className="size-4" />
                  About profile
                </p>
                <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
                  {profile.site_name || "Syahril Haryono"}
                </h1>
              </div>
              <p className="max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-right">{profile.tagline || "Full Stack Developer with an AI focus."}</p>
            </div>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-[360px_1fr] lg:items-stretch">
            <Reveal className="relative" delay={0.06}>
              <div className="relative h-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white/80 p-3 shadow-xl shadow-slate-950/10 backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:shadow-2xl dark:shadow-black/25">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem] bg-slate-100 dark:bg-slate-900">
                  {avatarUrl ? (
                    <Image
                      alt={profile.site_name || "Syahril Haryono"}
                      className="object-cover"
                      fill
                      priority
                      sizes="(min-width: 1024px) 360px, 100vw"
                      src={avatarUrl}
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-7xl font-semibold text-slate-500">SH</div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent p-5 pt-20">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">{statusText}</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex h-full flex-col justify-between rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-950/10 backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:shadow-2xl dark:shadow-black/20 sm:p-8">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-200">Short story</p>
                  <div className="mt-5 max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-200">
                    <MdxRenderer content={profile.bio || profile.site_description || profile.tagline} />
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link className="inline-flex h-11 items-center gap-2 rounded-full bg-cyan-300 px-5 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200" href="/contact">
                    Contact <ArrowRight className="size-4" />
                  </Link>
                  {profile.resume_url ? (
                    <Link
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 font-semibold text-slate-900 transition hover:-translate-y-0.5 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                      href={mediaUrl(profile.resume_url) ?? profile.resume_url}
                      target="_blank"
                    >
                      Resume <Download className="size-4" />
                    </Link>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-8 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoTile delay={0} icon={<BriefcaseBusiness className="size-5" />} label="Working on" value={profile.working_on || "AI-powered portfolio systems"} />
            <InfoTile delay={0.05} icon={<BookOpen className="size-5" />} label="Learning" value={profile.currently_learning || "AI engineering and scalable web architecture"} />
            <InfoTile delay={0.1} icon={<MapPin className="size-5" />} label="Work mode" value={labelize(profile.work_type)} />
            <InfoTile delay={0.15} icon={<Mail className="size-5" />} label="Email" value={profile.email} />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(16,185,129,0.12),transparent_26%),radial-gradient(circle_at_92%_28%,rgba(34,211,238,0.12),transparent_28%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">Stack</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Skills by focus area</h2>
            </div>
            <BrainCircuit className="hidden size-9 text-cyan-700 dark:text-cyan-300 sm:block" />
          </Reveal>
          <div className="relative mt-8 grid gap-4 lg:grid-cols-2">
            {Object.entries(groups).map(([category, items], index) => (
              <Reveal delay={Math.min(index * 0.04, 0.18)} key={category}>
              <article className="group rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-950/5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-950/10 dark:border-slate-800 dark:bg-slate-950/88 dark:hover:border-cyan-500/40">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{category}</h3>
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-800 transition group-hover:bg-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-200">{items.length} skills</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-500/40" key={skill.id}>
                      <SkillIcon className="size-4 text-cyan-700 dark:text-cyan-300" skill={skill} />
                      {skill.name}
                    </span>
                  ))}
                </div>
              </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="relative scroll-mt-24 overflow-hidden bg-white py-16 text-slate-950 dark:bg-slate-950 dark:text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]" />
        <div className="absolute left-0 top-12 size-64 rounded-full bg-cyan-300/15 blur-3xl dark:bg-cyan-400/10" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <TimelinePanel icon={<BriefcaseBusiness className="size-5" />} items={experiences.map((item) => ({
              id: item.id,
              date: `${formatDate(item.start_date)} - ${item.is_current ? "Present" : formatDate(item.end_date)}`,
              title: item.position,
              subtitle: [item.company, item.work_type, item.location_type].filter(Boolean).join(" - "),
              description: item.description,
            }))} title="Experience" />
          </Reveal>
          <Reveal delay={0.08}>
            <TimelinePanel icon={<GraduationCap className="size-5" />} items={educations.map((item) => ({
              id: item.id,
              date: `${formatDate(item.start_date)} - ${item.is_current ? "Present" : formatDate(item.end_date)}`,
              title: item.institution,
              subtitle: [item.degree, item.field].filter(Boolean).join(" - "),
              description: item.description,
            }))} title="Education" />
          </Reveal>
        </div>
      </section>

      <section id="certificates" className="relative scroll-mt-24 overflow-hidden border-t border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] py-16 dark:border-slate-800 dark:bg-[linear-gradient(180deg,#020617_0%,#07111f_100%)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
        <div className="absolute right-0 top-20 size-64 rounded-full bg-cyan-300/15 blur-3xl dark:bg-cyan-400/10" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">Certificates</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Credentials and recognitions</h2>
            </div>
            <Award className="hidden size-9 text-cyan-700 dark:text-cyan-300 sm:block" />
          </Reveal>
          <Reveal delay={0.05}>
          <form action="/about#certificates" className="relative mt-8 grid gap-3 rounded-[1.5rem] border border-slate-200 bg-white/90 p-3 shadow-sm shadow-slate-950/5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/86 sm:grid-cols-[1fr_auto_auto]">
            <input name="certificate_page" type="hidden" value="1" />
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-500 dark:focus:bg-slate-950"
                defaultValue={certificateSearch}
                name="certificate_search"
                placeholder="Search certificates by title, issuer, or category"
              />
            </label>
            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950" type="submit">
              Search
            </button>
            {certificateSearch ? (
              <Link className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200" href="/about#certificates">
                Clear <X className="size-4" />
              </Link>
            ) : null}
          </form>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(certificates.data ?? []).map((certificate, index) => {
              const logoUrl = mediaUrl(certificate.issuer_logo_url);
              return (
                <Reveal delay={Math.min(index * 0.05, 0.2)} key={certificate.id}>
                <article className="group overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-sm shadow-slate-950/5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-950/10 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-cyan-500/40">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-900">
                    {logoUrl ? (
                      <Image
                        alt={`${certificate.title} certificate`}
                        className="object-cover transition duration-500 group-hover:scale-105"
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        src={logoUrl}
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-cyan-700 dark:text-cyan-300">
                        <Award className="size-10" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/35 to-transparent" />
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2">
                      {certificate.category ? (
                        <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-200">
                          {certificate.category}
                        </span>
                      ) : null}
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        {formatLongDate(certificate.issued_at)}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold tracking-tight">{certificate.title}</h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">{certificate.issuer}</p>
                    {certificate.credential_url ? (
                      <a className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 hover:text-cyan-900 dark:text-cyan-300 dark:hover:text-cyan-100" href={certificate.credential_url} rel="noreferrer" target="_blank">
                        Verify credential <ExternalLink className="size-4" />
                      </a>
                    ) : null}
                  </div>
                </article>
                </Reveal>
              );
            })}
          </div>
          {(certificates.data ?? []).length === 0 ? (
            <p className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              {certificateSearch ? `No certificates found for "${certificateSearch}".` : "Certificate data is not available yet."}
            </p>
          ) : null}
          <CertificatePagination meta={certificates.meta} search={certificateSearch} />
        </div>
      </section>
    </main>
  );
}

function CertificatePagination({
  meta,
  search,
}: {
  meta?: { page?: number; total_pages?: number; total?: number };
  search: string;
}) {
  const page = meta?.page ?? 1;
  const totalPages = meta?.total_pages ?? 0;
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm shadow-slate-950/5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950">
      <p className="text-slate-600 dark:text-slate-300">
        Showing page <span className="font-semibold text-slate-950 dark:text-white">{page}</span> of{" "}
        <span className="font-semibold text-slate-950 dark:text-white">{totalPages}</span>
        {typeof meta?.total === "number" ? (
          <span className="ml-1 text-slate-500 dark:text-slate-400">({meta.total} total)</span>
        ) : null}
      </p>
      <div className="flex gap-2">
        <CertificatePageLink disabled={page <= 1} page={page - 1} search={search}>
          Previous
        </CertificatePageLink>
        <CertificatePageLink disabled={page >= totalPages} page={page + 1} search={search}>
          Next
        </CertificatePageLink>
      </div>
    </nav>
  );
}

function CertificatePageLink({
  children,
  disabled,
  page,
  search,
}: {
  children: React.ReactNode;
  disabled: boolean;
  page: number;
  search: string;
}) {
  if (disabled) {
    return (
      <span className="inline-flex h-10 items-center rounded-full border border-slate-200 px-4 font-semibold text-slate-400 dark:border-slate-800">
        {children}
      </span>
    );
  }

  const params = new URLSearchParams();
  if (search) params.set("certificate_search", search);
  params.set("certificate_page", String(page));

  return (
    <Link className="inline-flex h-10 items-center rounded-full border border-slate-200 px-4 font-semibold transition hover:border-cyan-400 dark:border-slate-800" href={`/about?${params.toString()}#certificates`}>
      {children}
    </Link>
  );
}

function InfoTile({ delay = 0, icon, label, value }: { delay?: number; icon: React.ReactNode; label: string; value: string }) {
  return (
    <Reveal className="h-full" delay={delay}>
    <article className="group relative flex h-full min-h-[168px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/85 p-5 text-slate-950 shadow-sm shadow-slate-950/5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-white hover:shadow-xl hover:shadow-cyan-950/10 dark:border-white/15 dark:bg-white/[0.08] dark:text-white dark:shadow-black/10 dark:hover:bg-white/[0.12] dark:hover:shadow-cyan-950/20">
      <span className="absolute -right-8 -top-8 size-20 rounded-full bg-cyan-300/12 blur-2xl transition group-hover:bg-cyan-300/25" />
      <span className="relative grid size-10 shrink-0 place-items-center rounded-2xl bg-cyan-50 text-cyan-800 ring-1 ring-cyan-200 dark:bg-cyan-300/10 dark:text-cyan-100 dark:ring-cyan-300/15">{icon}</span>
      <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 font-semibold leading-7 text-slate-900 dark:text-slate-100">{value}</p>
    </article>
    </Reveal>
  );
}

function TimelinePanel({
  icon,
  items,
  title,
}: {
  icon: React.ReactNode;
  items: { id: number; date: string; title: string; subtitle?: string | null; description?: string | null }[];
  title: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-950 shadow-xl shadow-slate-950/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:shadow-2xl dark:shadow-black/20 sm:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-emerald-300 to-violet-400" />
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-cyan-50 text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-200">{icon}</span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Timeline</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
        </div>
      </div>
      <div className="mt-7 space-y-6">
        {items.length ? (
          items.map((item, index) => (
            <Reveal delay={Math.min(index * 0.04, 0.2)} key={item.id}>
            <article className="relative border-l border-slate-200 pb-1 pl-5 transition hover:border-cyan-300 dark:border-slate-800 dark:hover:border-cyan-500/50" key={item.id}>
              <span className="absolute -left-1.5 top-1 size-3 rounded-full bg-cyan-600 ring-4 ring-white dark:bg-cyan-300 dark:ring-slate-950" />
              <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-200">{item.date}</p>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              {item.subtitle ? <p className="mt-1 text-slate-600 dark:text-slate-300">{item.subtitle}</p> : null}
              {item.description ? <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{plainText(item.description)}</p> : null}
            </article>
            </Reveal>
          ))
        ) : (
          <p className="leading-7 text-slate-600 dark:text-slate-300">Data is not available yet.</p>
        )}
      </div>
    </section>
  );
}

function labelize(value?: string | null) {
  return (value || "remote")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
