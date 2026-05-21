import { ArrowRight, Award, BrainCircuit, Layers3, Mail, Sparkles, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/blog-card";
import { CopyEmailButton } from "@/components/copy-email-button";
import { HomeCertificateCarousel } from "@/components/home-certificate-carousel";
import { HomeCommandCenter } from "@/components/home-command-center";
import { HomeFuturisticCard } from "@/components/home-futuristic-card";
import { HomeHero } from "@/components/home-hero";
import { HomeMotionBand } from "@/components/home-motion-band";
import { HomeProjectSpotlight } from "@/components/home-project-spotlight";
import { HomeSectionHeading } from "@/components/home-section-heading";
import { HomeSkillRadar } from "@/components/home-skill-radar";
import { ProjectCard } from "@/components/project-card";
import { SkillIcon } from "@/components/skill-icon";
import {
  getBlogs,
  getCertificates,
  getEducations,
  getExperiences,
  getSEOSettings,
  getProfile,
  getProjects,
  getSkills,
  mediaUrl,
} from "@/lib/api";
import { formatDate, formatLongDate, groupBy, plainText } from "@/lib/format";
import { metadataFromSEOPage, profileSeoImage, webPageJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [profile, seo] = await Promise.all([getProfile(), getSEOSettings()]);
  return metadataFromSEOPage(seo, "home", {
    title: profile.site_name || "Syahril Haryono",
    description: plainText(profile.site_description || profile.bio || profile.tagline).slice(0, 160),
    path: "/",
    image: profileSeoImage(profile),
    keywords: profile.site_keywords?.split(",").map((item) => item.trim()).filter(Boolean),
  });
}

export default async function Home() {
  const [profile, featuredProjects, recentBlogs, skills, experiences, educations, certificates] = await Promise.all([
    getProfile(),
    getProjects({ limit: 4, featured: true }),
    getBlogs({ limit: 3 }),
    getSkills(),
    getExperiences(),
    getEducations(),
    getCertificates({ limit: 6 }),
  ]);

  const projects = featuredProjects.data ?? [];
  const blogs = recentBlogs.data ?? [];
  const certificateItems = certificates.data ?? [];
  const skillGroups = groupBy(skills.slice(0, 24), (skill) => skill.category);
  const skillGroupStats = Object.entries(skillGroups).map(([category, items]) => ({ category, count: items.length }));
  const avatarUrl = mediaUrl(profile.avatar_url ?? profile.logo_url ?? profile.og_image_url);
  const spotlightProject = projects[0];
  const seo = await getSEOSettings();
  const homeJsonLd = seo?.pages.home ? webPageJsonLd(seo.pages.home, seo) : null;

  return (
    <>
      {homeJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} /> : null}
      <HomeHero
        avatarUrl={avatarUrl}
        blogCount={recentBlogs.meta?.total ?? blogs.length}
        profile={profile}
        projectCount={featuredProjects.meta?.total ?? projects.length}
        skillCount={skills.length}
      />
      <HomeMotionBand />
      <HomeCommandCenter />

      <section className="relative overflow-hidden border-b border-slate-200 bg-white py-20 text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.055)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="relative mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            ["Profile", profile.open_to_work ? `Open to ${profile.work_type}` : "Available for selected work", Sparkles],
            ["Projects", `${featuredProjects.meta?.total ?? projects.length} builds`, Layers3],
            ["Skills", `${skills.length} tools`, BrainCircuit],
            ["Certificates", `${certificates.meta?.total ?? certificateItems.length} credentials`, Award],
          ].map(([label, value, Icon], index) => {
            const TypedIcon = Icon as typeof Sparkles;
            return (
              <HomeFuturisticCard className="p-5" index={index} key={label as string}>
                <div className="flex items-center justify-between gap-3">
                  <TypedIcon className="size-5 text-cyan-300" />
                  <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_20px_rgba(110,231,183,0.8)]" />
                </div>
                <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label as string}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">{value as string}</p>
              </HomeFuturisticCard>
            );
          })}
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-slate-200 bg-[#f8fafc] py-24 dark:border-slate-800 dark:bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.15),transparent_32%),linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:auto,64px_64px] dark:bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_30%),linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <HomeSectionHeading eyebrow="Neural Profile" icon="brain" title="A fast overview of who I am">
            <p>{plainText(profile.bio || profile.site_description || profile.tagline)}</p>
          </HomeSectionHeading>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Currently learning", profile.currently_learning ?? "AI engineering, Go, scalable web architecture"],
              ["Working on", profile.working_on ?? "AI-powered portfolio systems"],
              ["Work mode", profile.work_type],
              ["Contact", profile.email],
            ].map(([label, value], index) => (
              <HomeFuturisticCard className="p-5" index={index} key={label}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">{label}</p>
                <p className="mt-3 text-lg font-semibold leading-7 text-slate-950 dark:text-white">{value}</p>
              </HomeFuturisticCard>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-24 dark:border-slate-800 dark:bg-[#020617]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <HomeSectionHeading eyebrow="Build Matrix" icon="layers" title="Featured projects">
              <p>Selected product, backend, and AI workflow builds with public detail pages.</p>
            </HomeSectionHeading>
            <Link className="inline-flex h-11 w-fit items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-5 text-sm font-semibold text-cyan-900 transition hover:-translate-y-0.5 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100" href="/projects">
              All projects <ArrowRight size={16} />
            </Link>
          </div>
          {spotlightProject ? (
            <HomeProjectSpotlight
              githubUrl={spotlightProject.github_url}
              imageUrl={mediaUrl(spotlightProject.thumbnail_url ?? spotlightProject.og_image_url)}
              liveUrl={spotlightProject.live_url}
              slug={spotlightProject.slug}
              summary={plainText(spotlightProject.summary)}
              techStack={spotlightProject.tech_stack ?? []}
              title={spotlightProject.title}
            />
          ) : null}
          <div className="grid gap-5 lg:grid-cols-2">
            {projects.slice(spotlightProject ? 1 : 0).map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-slate-200 bg-white py-24 text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(34,211,238,0.12),transparent_28%,rgba(168,85,247,0.12)_58%,transparent),linear-gradient(to_right,rgba(255,255,255,0.065)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:auto,64px_64px,64px_64px]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <HomeSectionHeading eyebrow="Capability Graph" icon="workflow" title="Skills grouped by system area">
              <p>Short version of the stack, from AI/ML and backend APIs to frontend delivery.</p>
            </HomeSectionHeading>
            <div className="mt-8 grid gap-3">
              {skillGroupStats.slice(0, 5).map((group, index) => (
                <HomeFuturisticCard className="p-4" index={index} key={group.category}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200">
                        <Zap className="size-4" />
                      </span>
                      <div>
                        <p className="font-semibold">{group.category}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Active capability cluster</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-cyan-700 dark:border-white/10 dark:bg-white/10 dark:text-cyan-100">{group.count}</span>
                  </div>
                </HomeFuturisticCard>
              ))}
            </div>
            <Link className="mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-5 text-sm font-semibold text-cyan-900 transition hover:-translate-y-0.5 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15" href="/about">
              Full profile <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-5">
            <HomeSkillRadar groups={skillGroupStats} />
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(skillGroups).map(([category, items], index) => (
                <HomeFuturisticCard className="p-5" index={index} key={category}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{category}</h3>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-cyan-700 dark:border-white/10 dark:bg-white/10 dark:text-cyan-100">{items.length}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-100" key={skill.id}>
                        <SkillIcon className="size-3.5 text-cyan-300" skill={skill} />
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </HomeFuturisticCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-slate-200 bg-[#f8fafc] py-24 dark:border-slate-800 dark:bg-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.06)_1px,transparent_1px)] bg-[size:70px_70px]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <HomeSectionHeading eyebrow="Runtime History" icon="briefcase" title="Experience">
                <p>Preview of recent work history. Open the full page for the complete timeline.</p>
              </HomeSectionHeading>
              <Link className="inline-flex h-10 w-fit items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 text-sm font-semibold text-cyan-900 transition hover:-translate-y-0.5 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100" href="/about#experience">
                Full timeline <ArrowRight size={15} />
              </Link>
            </div>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              Showing {Math.min(experiences.length, 3)} of {experiences.length || 0}
            </div>
            <div className="mt-8 space-y-4">
              {experiences.slice(0, 3).map((item, index) => (
                <HomeFuturisticCard className="p-5" index={index} key={item.id}>
                  <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">{formatDate(item.start_date)} - {item.is_current ? "Present" : formatDate(item.end_date)}</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{item.position}</h3>
                  <p className="mt-1 font-medium text-slate-700 dark:text-slate-200">{item.company} {item.location ? `- ${item.location}` : ""}</p>
                  {item.description ? <p className="mt-3 line-clamp-3 leading-7 text-slate-600 dark:text-slate-300">{plainText(item.description)}</p> : null}
                </HomeFuturisticCard>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <HomeSectionHeading eyebrow="Learning Path" icon="graduation" title="Education">
                <p>Preview of study history and structured learning. The full page has the rest.</p>
              </HomeSectionHeading>
              <Link className="inline-flex h-10 w-fit items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 text-sm font-semibold text-cyan-900 transition hover:-translate-y-0.5 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100" href="/about#experience">
                Full study path <ArrowRight size={15} />
              </Link>
            </div>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              Showing {Math.min(educations.length, 3)} of {educations.length || 0}
            </div>
            <div className="mt-8 space-y-4">
              {educations.slice(0, 3).map((item, index) => (
                <HomeFuturisticCard className="p-5" index={index} key={item.id}>
                  <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">{formatDate(item.start_date)} - {item.is_current ? "Present" : formatDate(item.end_date)}</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{item.institution}</h3>
                  <p className="mt-1 font-medium text-slate-700 dark:text-slate-200">{[item.degree, item.field].filter(Boolean).join(" - ")}</p>
                  {item.description ? <p className="mt-3 line-clamp-3 leading-7 text-slate-600 dark:text-slate-300">{plainText(item.description)}</p> : null}
                </HomeFuturisticCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-24 dark:border-slate-800 dark:bg-[#020617]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <HomeSectionHeading eyebrow="Verified Signals" icon="award" title="Certificates">
              <p>Credentials and certificates, previewed directly from the home page.</p>
            </HomeSectionHeading>
            <Link className="inline-flex h-11 w-fit items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-5 text-sm font-semibold text-cyan-900 transition hover:-translate-y-0.5 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100" href="/about#certificates">
              All certificates <ArrowRight size={16} />
            </Link>
          </div>
          <HomeCertificateCarousel
            items={certificateItems.slice(0, 6).map((certificate) => ({
              id: certificate.id,
              imageUrl: mediaUrl(certificate.issuer_logo_url),
              issuedAt: formatLongDate(certificate.issued_at),
              issuer: certificate.issuer,
              title: certificate.title,
            }))}
          />
        </div>
      </section>

      <section className="bg-white py-24 text-slate-950 dark:bg-slate-950 dark:text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <HomeSectionHeading eyebrow="Knowledge Stream" icon="pen" title="Recent writing">
              <p>Latest blog posts and AI-assisted drafts from the portfolio CMS.</p>
            </HomeSectionHeading>
            <Link className="inline-flex h-11 w-fit items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-5 text-sm font-semibold text-cyan-900 transition hover:-translate-y-0.5 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15" href="/blog">
              All articles <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {blogs.map((blog) => <BlogCard blog={blog} key={blog.id} />)}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f8fafc] py-24 dark:bg-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <HomeFuturisticCard className="p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-800 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200">
                  <Mail className="size-4" /> Contact
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">Need a full-stack AI workflow?</h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                  Send a message, review the projects, or ask the AI chat about Syahril&apos;s profile and work.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-5 font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950" href="/contact">
                  Contact me <ArrowRight size={18} />
                </Link>
                <CopyEmailButton email={profile.email} />
                <Link className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-950 dark:text-white" href="/about">
                  About page
                </Link>
              </div>
            </div>
          </HomeFuturisticCard>
        </div>
      </section>
    </>
  );
}
