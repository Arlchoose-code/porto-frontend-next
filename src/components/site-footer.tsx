"use client";

import { Code2, Mail, Network } from "lucide-react";
import { usePathname } from "next/navigation";
import type { Profile } from "@/lib/types";

export function SiteFooter({ profile }: { profile?: Profile }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:text-slate-400">
        <p>
          © {new Date().getFullYear()} {profile?.site_name ?? "Syahril Haryono"}.
        </p>
        <div className="flex items-center gap-3">
          {profile?.email ? (
            <a className="inline-flex items-center gap-2 hover:text-slate-950 dark:hover:text-white" href={`mailto:${profile.email}`}>
              <Mail size={16} /> Email
            </a>
          ) : null}
          {profile?.github_url ? (
            <a className="inline-flex items-center gap-2 hover:text-slate-950 dark:hover:text-white" href={profile.github_url} rel="noreferrer" target="_blank">
              <Code2 size={16} /> GitHub
            </a>
          ) : null}
          {profile?.linkedin_url ? (
            <a className="inline-flex items-center gap-2 hover:text-slate-950 dark:hover:text-white" href={profile.linkedin_url} rel="noreferrer" target="_blank">
              <Network size={16} /> LinkedIn
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
