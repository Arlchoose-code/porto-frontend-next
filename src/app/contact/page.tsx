import { Code2, Mail, MessageSquare, Network, Send, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { getProfile, getSEOSettings } from "@/lib/api";
import { metadataFromSEOPage, profileSeoImage, webPageJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [profile, seo] = await Promise.all([getProfile(), getSEOSettings()]);
  return metadataFromSEOPage(seo, "contact", {
    title: "Contact",
    description: `Contact ${profile.site_name || "Syahril Haryono"} for full-stack, backend, frontend, and AI workflow collaboration.`,
    path: "/contact",
    image: profileSeoImage(profile),
    keywords: ["contact", "hire full stack developer", "AI engineer", ...(profile.site_keywords?.split(",").map((item) => item.trim()).filter(Boolean) ?? [])],
  });
}

export default async function ContactPage() {
  const profile = await getProfile();
  const seo = await getSEOSettings();
  const pageJsonLd = seo?.pages.contact ? webPageJsonLd(seo.pages.contact, seo) : null;

  return (
    <main className="bg-[#f6f9fc] text-slate-950 dark:bg-[#020617] dark:text-white">
      {pageJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} /> : null}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_45%,#f5f3ff_100%)] pt-24 dark:bg-[linear-gradient(135deg,#020617_0%,#071826_52%,#160f2a_100%)] sm:pt-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.055)_1px,transparent_1px)]" />
        <div className="absolute left-[-4rem] top-24 size-72 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-400/12" />
        <div className="absolute right-[-5rem] bottom-[-5rem] size-80 rounded-full bg-fuchsia-300/20 blur-3xl dark:bg-fuchsia-500/12" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-sm font-semibold text-cyan-800 shadow-sm backdrop-blur dark:border-cyan-400/20 dark:bg-slate-950/70 dark:text-cyan-200">
                  <MessageSquare className="size-4" />
                  Contact channel
                </p>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">Contact</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                  Send a message for work, collaboration, project discussion, or AI workflow ideas.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">
                <p className="inline-flex items-center gap-2 font-semibold text-cyan-700 dark:text-cyan-300">
                  <Sparkles className="size-4" />
                  Response path
                </p>
                <p className="mt-1">Messages go straight to the portfolio inbox.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative border-t border-slate-200 py-16 dark:border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(16,185,129,0.1),transparent_24%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <Reveal>
            <aside className="grid gap-4">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950">
                <h2 className="text-2xl font-semibold tracking-tight">Direct links</h2>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                  Prefer direct channels? Use email or social profiles below.
                </p>
                <div className="mt-6 grid gap-3">
                  {profile.email ? (
                    <ContactLink href={`mailto:${profile.email}`} icon={<Mail className="size-5" />} label="Email" value={profile.email} />
                  ) : null}
                  {profile.github_url ? (
                    <ContactLink external href={profile.github_url} icon={<Code2 className="size-5" />} label="GitHub" value="Arlchoose-code" />
                  ) : null}
                  {profile.linkedin_url ? (
                    <ContactLink external href={profile.linkedin_url} icon={<Network className="size-5" />} label="LinkedIn" value="Syahril Haryono" />
                  ) : null}
                </div>
              </div>
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 text-slate-950 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:shadow-2xl dark:shadow-slate-950/15">
                <div className="absolute" />
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 dark:text-cyan-200">
                  <Send className="size-4" />
                  Message tips
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <li>Include project scope, stack, timeline, and expected outcome.</li>
                  <li>Long messages are fine. Line breaks are preserved in the inbox.</li>
                  <li>For AI work, mention dataset, model, API, or deployment constraints.</li>
                </ul>
              </div>
            </aside>
          </Reveal>

          <Reveal delay={0.08}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function ContactLink({
  external,
  href,
  icon,
  label,
  value,
}: {
  external?: boolean;
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <a
      className="group flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white dark:border-slate-800 dark:bg-[#020617] dark:hover:border-cyan-500/40"
      href={href}
      rel={external ? "noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-cyan-50 text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-200">{icon}</span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</span>
        <span className="block truncate font-semibold text-slate-950 group-hover:text-cyan-800 dark:text-white dark:group-hover:text-cyan-200">{value}</span>
      </span>
    </a>
  );
}
