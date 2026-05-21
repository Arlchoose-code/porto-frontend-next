"use client";

import Link from "next/link";
import Image from "next/image";
import { Bot, Code2, FolderKanban, Home, Mail, Menu, Network, Search, UserRound, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { createPortal } from "react-dom";
import type { Profile } from "@/lib/types";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: UserRound },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/blog", label: "Blog", icon: Code2 },
  { href: "/code-explainer", label: "Explainer", icon: Bot },
  { href: "/contact", label: "Contact", icon: Mail },
];

const mobileNavItems = [
  ...navItems.slice(0, 5),
  { href: "/search", label: "Search", icon: Search },
  ...navItems.slice(5),
];

export function SiteHeader({ profile }: { profile?: Profile }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const portalTarget = typeof document === "undefined" ? null : document.body;
  const logoUrl = publicMediaUrl(profile?.logo_url ?? profile?.favicon_url ?? profile?.avatar_url);

  if (pathname.startsWith("/admin")) return null;

  return (
    <motion.header
      className="sticky top-0 z-[80] border-b border-slate-200/80 bg-white/90 shadow-sm shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-black/20"
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-950 text-sm font-semibold text-white ring-1 ring-slate-200 dark:bg-white dark:text-slate-950 dark:ring-slate-800">
            {logoUrl ? (
              <Image
                alt={profile?.site_name ?? "Syahril Haryono"}
                className="object-cover"
                fill
                sizes="36px"
                src={logoUrl}
                unoptimized
              />
            ) : (
              "SH"
            )}
          </span>
          <span className="block truncate text-sm font-semibold tracking-tight sm:text-base">
            {profile?.site_name ?? "Syahril Haryono"}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              className={`relative rounded-xl px-3 py-2 text-sm font-medium transition ${
                pathname === item.href
                  ? "text-slate-950 dark:text-white"
                  : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
              }`}
              href={item.href}
              key={item.href}
            >
              {pathname === item.href ? (
                <motion.span
                  className="absolute inset-0 rounded-xl bg-slate-100 dark:bg-slate-900"
                  layoutId="site-nav-active"
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />
              ) : null}
              <span className="relative">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {profile?.github_url ? (
            <a
              aria-label="GitHub"
              className="hidden size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-400 md:inline-flex dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              href={profile.github_url}
              rel="noreferrer"
              target="_blank"
            >
              <Code2 size={18} />
            </a>
          ) : null}
          {profile?.linkedin_url ? (
            <a
              aria-label="LinkedIn"
              className="hidden size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-400 md:inline-flex dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              href={profile.linkedin_url}
              rel="noreferrer"
              target="_blank"
            >
              <Network size={18} />
            </a>
          ) : null}
          <Link
            aria-label="Search"
            className={`inline-flex h-10 w-10 items-center justify-center gap-2 rounded-xl border px-0 text-sm font-semibold shadow-sm transition lg:w-auto lg:px-3 ${
              pathname === "/search"
                ? "border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
                : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-cyan-700 dark:hover:text-white"
            }`}
            href="/search"
          >
            <Search size={18} />
            <span className="hidden lg:inline">Search</span>
          </Link>
          <ThemeToggle />
          <button
            aria-expanded={open}
            aria-label="Open navigation"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 md:hidden"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {portalTarget
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.button
                  aria-label="Close navigation backdrop"
                  className="fixed inset-0 z-[70] cursor-default bg-white/55 backdrop-blur-2xl md:hidden dark:bg-slate-950/65"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  onClick={() => setOpen(false)}
                  type="button"
                />
              ) : null}
            </AnimatePresence>,
            portalTarget,
          )
        : null}
      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              className="absolute left-3 right-3 top-[calc(100%+0.5rem)] z-[90] overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl shadow-slate-950/15 md:hidden dark:border-slate-800/80 dark:bg-slate-950 dark:shadow-black/40"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav className="grid gap-1">
                {mobileNavItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, delay: index * 0.018, ease: "easeOut" }}
                      key={item.href}
                    >
                      <Link
                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                          pathname === item.href
                            ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                        }`}
                        href={item.href}
                        onClick={() => setOpen(false)}
                      >
                        <span
                          className={`grid size-8 place-items-center rounded-lg ${
                            pathname === item.href
                              ? "bg-white/15 dark:bg-slate-950/10"
                              : "bg-slate-100 text-cyan-700 dark:bg-slate-900 dark:text-cyan-300"
                          }`}
                        >
                          <Icon size={17} />
                        </span>
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}

function publicMediaUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const uploadIndex = normalized.indexOf("/uploads/");
  if (uploadIndex >= 0) return `/api/asset?path=${encodeURIComponent(normalized.slice(uploadIndex))}`;
  return normalized;
}
