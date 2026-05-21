"use client";

import {
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  FileText,
  GraduationCap,
  Globe2,
  Image as ImageIcon,
  Inbox,
  KeyRound,
  ImageUp,
  LayoutDashboard,
  LogOut,
  Mail,
  RefreshCw,
  Rocket,
  Save,
  Search,
  Shield,
  Sparkles,
  Star,
  Trash2,
  Trophy,
  User,
  Users,
  Wrench,
  Menu,
  Pencil,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createContext, FormEvent, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RichTextEditor } from "./rich-text-editor";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  meta?: { page?: number; limit?: number; total?: number; total_pages?: number };
};

type IconType = typeof Rocket;

type ResourceKey =
  | "projects"
  | "blogs"
  | "certificates"
  | "experiences"
  | "educations"
  | "skills";

type ResourceConfig = {
  key: ResourceKey;
  label: string;
  icon: IconType;
  description: string;
  emptyPayload: Record<string, unknown>;
};

type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox" | "date" | "number" | "tags";
  options?: string[];
  required?: boolean;
};

const controlClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-200/50 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:shadow-black/10 dark:hover:border-slate-700 dark:focus:border-teal-400";

const softPanelClass =
  "rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/20";

const primaryButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm shadow-teal-900/10 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400";

const secondaryButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/50 transition hover:border-teal-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:shadow-black/10 dark:hover:border-teal-600 dark:hover:text-white";

const dangerButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 dark:border-red-900 dark:bg-slate-950 dark:hover:bg-red-950";

type ToastTone = "success" | "error" | "info";

type AdminToast = {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
};

type SeoIssue = {
  title: string;
  resource: string;
  href: string;
  issue: string;
  tone: "error" | "warning" | "info";
};

type ToastInput = Omit<AdminToast, "id">;

const AdminToastContext = createContext<(toast: ToastInput) => void>(() => undefined);

function useAdminToast() {
  return useContext(AdminToastContext);
}

const resourceConfigs: Record<ResourceKey, ResourceConfig> = {
  projects: {
    key: "projects",
    label: "Projects",
    icon: Rocket,
    description: "Create, edit, publish, and feature portfolio projects.",
    emptyPayload: {
      title: "",
      summary: "",
      description: "",
      tech_stack: [],
      status: "draft",
      featured: false,
      order: 0,
    },
  },
  blogs: {
    key: "blogs",
    label: "Blogs",
    icon: BookOpen,
    description: "Manage manual and AI-assisted articles.",
    emptyPayload: {
      title: "",
      summary: "",
      content: "",
      tags: [],
      status: "draft",
      author_type: "user",
    },
  },
  certificates: {
    key: "certificates",
    label: "Certificates",
    icon: Trophy,
    description: "Track credentials, issuers, and verification URLs.",
    emptyPayload: {
      title: "",
      issuer: "",
      issued_at: new Date().toISOString().slice(0, 10),
      category: "",
      order: 0,
    },
  },
  experiences: {
    key: "experiences",
    label: "Experience",
    icon: BriefcaseBusiness,
    description: "Work history and timeline items.",
    emptyPayload: {
      company: "",
      position: "",
      work_type: "fulltime",
      location_type: "remote",
      start_date: new Date().toISOString().slice(0, 10),
      is_current: false,
      order: 0,
    },
  },
  educations: {
    key: "educations",
    label: "Education",
    icon: GraduationCap,
    description: "Formal education timeline entries.",
    emptyPayload: {
      institution: "",
      degree: "",
      field: "",
      start_date: new Date().toISOString().slice(0, 10),
      is_current: false,
      order: 0,
    },
  },
  skills: {
    key: "skills",
    label: "Skills",
    icon: Wrench,
    description: "Categorized technical skills and proficiency.",
    emptyPayload: {
      name: "",
      category: "Frontend",
      level: "intermediate",
      order: 0,
    },
  },
};

const resourceFields: Record<ResourceKey, FieldConfig[]> = {
  projects: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "summary", label: "Summary", type: "textarea", required: true },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "tech_stack", label: "Tech Stack", type: "tags" },
    { name: "status", label: "Status", type: "select", options: ["draft", "published"] },
    { name: "featured", label: "Featured", type: "checkbox" },
    { name: "thumbnail_url", label: "Thumbnail URL", type: "text" },
    { name: "github_url", label: "GitHub URL", type: "text" },
    { name: "huggingface_url", label: "HuggingFace URL", type: "text" },
    { name: "live_url", label: "Live URL", type: "text" },
    { name: "order", label: "Order", type: "number" },
    { name: "meta_title", label: "Meta Title", type: "text" },
    { name: "meta_description", label: "Meta Description", type: "textarea" },
    { name: "og_image_url", label: "OG Image URL", type: "text" },
  ],
  blogs: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "summary", label: "Summary", type: "textarea" },
    { name: "content", label: "Content", type: "textarea", required: true },
    { name: "tags", label: "Tags", type: "tags" },
    { name: "status", label: "Status", type: "select", options: ["draft", "published"] },
    { name: "author_type", label: "Author Type", type: "select", options: ["user", "ai"] },
    { name: "thumbnail_url", label: "Thumbnail URL", type: "text" },
    { name: "meta_title", label: "Meta Title", type: "text" },
    { name: "meta_description", label: "Meta Description", type: "textarea" },
    { name: "canonical_url", label: "Canonical URL", type: "text" },
    { name: "og_image_url", label: "OG Image URL", type: "text" },
  ],
  certificates: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "issuer", label: "Issuer", type: "text", required: true },
    { name: "issued_at", label: "Issued At", type: "date", required: true },
    { name: "category", label: "Category", type: "text" },
    { name: "credential_id", label: "Credential ID", type: "text" },
    { name: "credential_url", label: "Credential URL", type: "text" },
    { name: "issuer_logo_url", label: "Issuer Logo URL", type: "text" },
    { name: "order", label: "Order", type: "number" },
  ],
  experiences: [
    { name: "company", label: "Company", type: "text", required: true },
    { name: "position", label: "Position", type: "text", required: true },
    { name: "location", label: "Location", type: "text" },
    { name: "work_type", label: "Work Type", type: "select", options: ["fulltime", "parttime", "internship", "freelance", "volunteer"] },
    { name: "location_type", label: "Location Type", type: "select", options: ["remote", "onsite", "hybrid"] },
    { name: "start_date", label: "Start Date", type: "date", required: true },
    { name: "end_date", label: "End Date", type: "date" },
    { name: "is_current", label: "Current Role", type: "checkbox" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "company_url", label: "Company URL", type: "text" },
    { name: "order", label: "Order", type: "number" },
  ],
  educations: [
    { name: "institution", label: "Institution", type: "text", required: true },
    { name: "degree", label: "Degree", type: "text" },
    { name: "field", label: "Field", type: "text" },
    { name: "start_date", label: "Start Date", type: "date", required: true },
    { name: "end_date", label: "End Date", type: "date" },
    { name: "is_current", label: "Current Study", type: "checkbox" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "institution_url", label: "Institution URL", type: "text" },
    { name: "order", label: "Order", type: "number" },
  ],
  skills: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "category", label: "Category", type: "select", options: ["Frontend", "Backend", "Database", "AI/ML", "Cloud", "DevOps", "Design", "Tooling"], required: true },
    { name: "level", label: "Level", type: "select", options: ["beginner", "intermediate", "advanced", "expert"] },
    { name: "order", label: "Order", type: "number" },
  ],
};

const profileFields: FieldConfig[] = [
  { name: "tagline", label: "Tagline", type: "text", required: true },
  { name: "bio", label: "Bio", type: "textarea", required: true },
  { name: "open_to_work", label: "Open To Work", type: "checkbox" },
  { name: "work_type", label: "Work Type", type: "select", options: ["remote", "onsite", "hybrid", "any"] },
  { name: "available_from", label: "Available From", type: "date" },
  { name: "working_on", label: "Working On", type: "text" },
  { name: "currently_learning", label: "Currently Learning", type: "text" },
  { name: "email", label: "Public Email", type: "text", required: true },
  { name: "github_url", label: "GitHub URL", type: "text" },
  { name: "linkedin_url", label: "LinkedIn URL", type: "text" },
  { name: "huggingface_url", label: "HuggingFace URL", type: "text" },
  { name: "avatar_url", label: "Avatar", type: "text" },
  { name: "resume_url", label: "Resume/CV", type: "text" },
  { name: "site_name", label: "Site Name", type: "text", required: true },
  { name: "site_description", label: "Site Description", type: "textarea" },
  { name: "site_keywords", label: "Site Keywords", type: "text" },
  { name: "og_image_url", label: "OG Image", type: "text" },
  { name: "logo_url", label: "Logo", type: "text" },
  { name: "favicon_url", label: "Favicon", type: "text" },
];

const navItems: Array<{ href: string; label: string; icon: IconType }> = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/seo", label: "SEO", icon: Globe2 },
  { href: "/admin/projects", label: "Projects", icon: Rocket },
  { href: "/admin/blogs", label: "Blogs", icon: BookOpen },
  { href: "/admin/certificates", label: "Certificates", icon: Trophy },
  { href: "/admin/experiences", label: "Experience", icon: BriefcaseBusiness },
  { href: "/admin/educations", label: "Education", icon: GraduationCap },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/contacts", label: "Inbox", icon: Inbox },
  { href: "/admin/media", label: "Media", icon: ImageUp },
  { href: "/admin/revalidate", label: "Revalidate", icon: RefreshCw },
  { href: "/admin/generate", label: "AI Blog", icon: Sparkles },
  { href: "/admin/users", label: "Users", icon: Users },
];

function readToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("admin_access_token") ?? "";
}

function writeTokens(accessToken: string, refreshToken?: string) {
  window.localStorage.setItem("admin_access_token", accessToken);
  if (refreshToken) window.localStorage.setItem("admin_refresh_token", refreshToken);
}

async function adminFetch<T>(path: string, token: string, init?: RequestInit) {
  const response = await fetch(`/api/admin/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...init?.headers,
    },
  });
  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !body?.success) throw new Error(body?.message ?? "Request failed");
  return body;
}

async function adminUpload<T>(path: string, token: string, body: FormData) {
  const response = await fetch(`/api/admin/${path}`, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body,
  });
  const result = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !result?.success) throw new Error(result?.message ?? "Upload failed");
  return result;
}

async function uploadMediaFile(file: File, token: string) {
  const form = new FormData();
  form.set("file", file);
  const res = await adminUpload<Record<string, unknown>>("media/upload", token, form);
  const media = res.data ?? {};
  return String(media.file_path ?? media.file_url ?? "");
}

function publicAssetUrl(path?: unknown) {
  const raw = String(path ?? "");
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/uploads/")) return `/api/asset?path=${encodeURIComponent(raw)}`;
  if (raw.includes("/uploads/")) {
    return `/api/asset?path=${encodeURIComponent(raw.slice(raw.indexOf("/uploads/")))}`;
  }
  return raw;
}

function itemMediaPath(item: Record<string, unknown>) {
  return item.thumbnail_url ?? item.avatar_url ?? item.og_image_url ?? item.logo_url ?? item.favicon_url ?? item.issuer_logo_url ?? item.file_path ?? "";
}

function isImagePath(path: string) {
  return /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(path) || path.includes("-medium.jpg");
}

function normalizeAdminPayload(item: Record<string, unknown>, mode: "edit" | "create") {
  const copy: Record<string, unknown> = { ...item };

  if (mode === "edit") {
    ["created_at", "updated_at", "slug", "reading_time", "published_at"].forEach((key) => delete copy[key]);
  }

  Object.keys(copy).forEach((key) => {
    const value = copy[key];
    if (
      typeof value === "string" &&
      (key.endsWith("_date") || key === "issued_at" || key === "available_from") &&
      /^\d{4}-\d{2}-\d{2}/.test(value)
    ) {
      copy[key] = value.slice(0, 10);
    }
  });

  return copy;
}

function tagsForResource(key: ResourceKey) {
  return [key];
}

function publicPreviewHref(key: ResourceKey, item: Record<string, unknown>) {
  const slug = String(item.slug ?? "");
  const id = String(item.id ?? "");
  const status = String(item.status ?? "");
  if (status === "draft" && id && (key === "blogs" || key === "projects")) return `/preview/${key}/${id}`;
  if (!slug) return "";
  if (key === "projects") return `/projects/${slug}`;
  if (key === "blogs") return `/blog/${slug}`;
  return "";
}

async function revalidateAdminTags(token: string, tags: string[]) {
  await adminFetch("revalidate", token, {
    method: "POST",
    body: JSON.stringify({ tags }),
  }).catch(() => undefined);
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toasts, setToasts] = useState<AdminToast[]>([]);
  const isLogin = pathname === "/admin/login";
  const notify = useCallback((toast: ToastInput) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { ...toast, id }].slice(-4));
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  useEffect(() => {
    const syncToken = () => {
      setToken(readToken());
      setMounted(true);
    };

    syncToken();
    window.addEventListener("admin-auth-change", syncToken);
    window.addEventListener("storage", syncToken);

    return () => {
      window.removeEventListener("admin-auth-change", syncToken);
      window.removeEventListener("storage", syncToken);
    };
  }, [pathname]);

  if (isLogin) return <>{children}</>;

  const logout = () => {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_refresh_token");
    setToken("");
    window.dispatchEvent(new Event("admin-auth-change"));
    notify({ tone: "info", title: "Signed out" });
    router.push("/admin/login");
  };

  return (
    <AdminToastContext.Provider value={notify}>
      <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#d9f99d_0,transparent_30rem),linear-gradient(135deg,#f8fafc_0%,#eef2f7_45%,#ecfeff_100%)] text-slate-950 dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16)_0,transparent_28rem),linear-gradient(135deg,#020617_0%,#0f172a_48%,#111827_100%)] dark:text-slate-50">
        <button
          className="fixed left-4 top-4 z-50 inline-flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-white/95 shadow-lg shadow-slate-950/10 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-900/95"
          type="button"
          aria-label="Open admin navigation"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={20} />
        </button>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-800 bg-slate-950 text-slate-100 shadow-2xl shadow-slate-950/30 lg:flex lg:flex-col">
        <AdminSidebar pathname={pathname} onLogout={logout} onNavigate={() => undefined} />
      </aside>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              aria-label="Close admin navigation"
              className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm lg:hidden"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-[min(88vw,336px)] flex-col border-r border-slate-800 bg-slate-950 text-slate-100 shadow-2xl lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <AdminSidebar pathname={pathname} onLogout={logout} onNavigate={() => setMobileOpen(false)} onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

        <div className="h-full min-w-0 overflow-y-auto overscroll-contain px-4 pb-8 pt-20 [scrollbar-color:rgba(20,184,166,0.45)_transparent] [scrollbar-width:thin] sm:px-6 lg:ml-72 lg:px-8 lg:pt-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-teal-500/40 [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="mx-auto max-w-[1500px]">
            {!mounted ? <AdminLoading /> : token ? children : <AuthRequired />}
          </div>
        </div>
        <AdminToastViewport toasts={toasts} onDismiss={(id) => setToasts((current) => current.filter((item) => item.id !== id))} />
      </div>
    </AdminToastContext.Provider>
  );
}

function AdminToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: AdminToast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-4 z-[80] flex flex-col gap-2 sm:left-auto sm:right-4 sm:w-96">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = toast.tone === "success" ? CheckCircle2 : toast.tone === "error" ? X : Sparkles;
          const toneClass = toast.tone === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
            : toast.tone === "error"
              ? "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100"
              : "border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-100";

          return (
            <motion.div
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl shadow-slate-950/10 backdrop-blur ${toneClass}`}
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Icon className="mt-0.5 shrink-0" size={18} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description ? <p className="mt-1 text-xs leading-5 opacity-80">{toast.description}</p> : null}
              </div>
              <button className="rounded-md p-1 opacity-70 transition hover:bg-white/40 hover:opacity-100 dark:hover:bg-black/20" type="button" aria-label="Dismiss toast" onClick={() => onDismiss(toast.id)}>
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function AdminSidebar({
  pathname,
  onLogout,
  onNavigate,
  onClose,
}: {
  pathname: string;
  onLogout: () => void;
  onNavigate: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain [scrollbar-color:rgba(148,163,184,0.45)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent">
      <div className="shrink-0 border-b border-white/10 p-4">
        <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-inner shadow-white/5">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-teal-400 text-slate-950 shadow-lg shadow-teal-950/20">
              <Shield size={19} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-teal-200">Portfolio CMS</p>
              <p className="mt-1 truncate text-lg font-semibold text-white">Syahril Admin</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-slate-300">
            <span className="rounded-lg bg-white/[0.07] px-2 py-1.5">Content</span>
            <span className="rounded-lg bg-white/[0.07] px-2 py-1.5">Media</span>
            <span className="rounded-lg bg-white/[0.07] px-2 py-1.5">Cache</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-teal-200">
            <User size={18} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">Portfolio Admin</p>
            <p className="truncate text-xs text-slate-400">Workspace active</p>
          </div>
        </div>
        {onClose ? (
          <button className="rounded-xl p-2 text-slate-300 hover:bg-white/10" type="button" aria-label="Close admin navigation" onClick={onClose}>
            <X size={18} />
          </button>
        ) : null}
        </div>
      </div>

      <nav className="space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-teal-400 text-slate-950 shadow-lg shadow-teal-950/20"
                  : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
              }`}
              href={item.href}
              key={item.href}
              onClick={onNavigate}
            >
              <Icon className={active ? "text-slate-950" : "text-slate-400 transition group-hover:text-teal-200"} size={17} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto shrink-0 border-t border-white/10 p-3">
        <button
          className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
          type="button"
          onClick={onLogout}
        >
          <LogOut size={17} /> Logout
        </button>
      </div>
    </div>
  );
}

function AdminLoading() {
  return (
    <Panel title="Loading admin" description="Checking local session.">
      <div className="h-32 animate-pulse rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
    </Panel>
  );
}

function AuthRequired() {
  return (
    <Panel title="Admin access required" description="Sign in with an admin account to manage portfolio content.">
      <Link className="inline-flex h-10 items-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white dark:bg-white dark:text-slate-950" href="/admin/login">
        Go to login
      </Link>
    </Panel>
  );
}

export function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const res = await adminFetch<{ access_token: string; refresh_token?: string }>("auth/login", "", {
        method: "POST",
        body: JSON.stringify({
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
        }),
      });
      writeTokens(res.data?.access_token ?? "", res.data?.refresh_token);
      window.dispatchEvent(new Event("admin-auth-change"));
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#ccfbf1_0,transparent_28rem),linear-gradient(135deg,#f8fafc,#e2e8f0)] px-4 py-12 dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18)_0,transparent_28rem),linear-gradient(135deg,#020617,#0f172a)]">
      <form className="w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-6 shadow-2xl shadow-slate-950/10 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-black/30" onSubmit={submit}>
        <div className="mb-6 rounded-2xl bg-slate-950 p-5 text-white dark:bg-white dark:text-slate-950">
          <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-teal-400 text-slate-950 shadow-lg shadow-teal-950/20">
            <KeyRound size={18} />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-300 dark:text-slate-600">Manage portfolio content, media, and publishing workflows.</p>
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Email
          <input className={controlClass} name="email" required type="email" />
        </label>
        <label className="mt-4 grid gap-2 text-sm font-medium">
          Password
          <input className={controlClass} name="password" required type="password" />
        </label>
        <button className={`${primaryButtonClass} mt-6 w-full`} disabled={loading} type="submit">
          {loading ? "Signing in" : "Sign in"}
        </button>
        {error ? <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-300">{error}</p> : null}
      </form>
    </div>
  );
}

export function DashboardPage() {
  const token = readToken();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [recent, setRecent] = useState<Record<string, Array<Record<string, unknown>>>>({});
  const [seoIssues, setSeoIssues] = useState<SeoIssue[]>([]);

  useEffect(() => {
    Promise.all(
      ["projects", "blogs", "certificates", "contacts"].map(async (key) => {
        const res = await adminFetch<Array<Record<string, unknown>>>(`${key}?limit=4`, token).catch(() => ({ meta: { total: 0 }, data: [] }));
        return [key, res] as const;
      }),
    ).then((entries) => {
      setCounts(Object.fromEntries(entries.map(([key, res]) => [key, res.meta?.total ?? res.data?.length ?? 0])));
      setRecent(Object.fromEntries(entries.map(([key, res]) => [key, res.data ?? []])));
    });

    Promise.all([
      adminFetch<Record<string, unknown>>("profile", token).catch(() => ({ data: {} })),
      adminFetch<Array<Record<string, unknown>>>("projects?limit=100", token).catch(() => ({ data: [] })),
      adminFetch<Array<Record<string, unknown>>>("blogs?limit=100", token).catch(() => ({ data: [] })),
    ]).then(([profileRes, projectsRes, blogsRes]) => {
      setSeoIssues(buildSeoIssues(profileRes.data ?? {}, projectsRes.data ?? [], blogsRes.data ?? []));
    });
  }, [token]);

  const cards: Array<[string, number, IconType, string, string]> = [
    ["Projects", counts.projects ?? 0, Rocket, "/admin/projects", "Manage portfolio work"],
    ["Blogs", counts.blogs ?? 0, BookOpen, "/admin/blogs", "Publish articles"],
    ["Certificates", counts.certificates ?? 0, Trophy, "/admin/certificates", "Track credentials"],
    ["Inbox", counts.contacts ?? 0, Inbox, "/admin/contacts", "Review messages"],
  ];

  const actions: Array<[string, string, string, IconType]> = [
    ["New Project", "/admin/projects", "Add or update featured portfolio work.", Rocket],
    ["Write Blog", "/admin/blogs", "Create manual articles or edit generated drafts.", BookOpen],
    ["Generate AI Draft", "/admin/generate", "Run single or batch blog generation.", Sparkles],
    ["Upload Media", "/admin/media", "Store optimized image assets.", ImageUp],
    ["Update Profile", "/admin/profile", "Edit global SEO, status, and contact links.", User],
    ["Revalidate", "/admin/revalidate", "Refresh cached public pages after edits.", RefreshCw],
  ];

  return (
    <Panel title="Dashboard" description="Control center for portfolio content, AI writing, media, inbox, and cache revalidation.">
      <div className="grid gap-5">
        <section className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20 dark:border dark:border-slate-800">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-teal-200">Portfolio Admin</p>
              <h2 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">Manage content, media, SEO, and publishing in one focused workspace.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Update profile data, publish content, generate AI drafts, upload media, and revalidate cached pages from one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Link className="inline-flex h-10 items-center gap-2 rounded-xl bg-teal-400 px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-teal-950/20" href="/admin/generate">
                <Sparkles size={16} /> AI Blog
              </Link>
              <Link className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 px-4 text-sm font-semibold text-white hover:bg-white/10" href="/admin/projects">
                <Rocket size={16} /> Projects
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(([label, value, Icon, href, helper]) => (
            <Link className="group rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm shadow-slate-200/50 transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-950/5 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-black/10 dark:hover:border-teal-700" href={href} key={label}>
              <div className="flex items-start justify-between gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-600 group-hover:text-white dark:bg-teal-950 dark:text-teal-200">
                  <Icon size={21} />
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">Open</span>
              </div>
              <p className="mt-4 text-3xl font-semibold">{value}</p>
              <p className="font-medium">{label}</p>
              <p className="mt-1 text-sm text-slate-500">{helper}</p>
            </Link>
          ))}
        </section>

        <SEOHealthPanel issues={seoIssues} totalContent={(counts.projects ?? 0) + (counts.blogs ?? 0) + 1} />

        <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className={`${softPanelClass} p-5`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Quick Actions</h2>
                <p className="text-sm text-slate-500">Common admin workflows.</p>
              </div>
              <Star className="text-teal-700 dark:text-teal-300" size={20} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {actions.map(([label, href, helper, Icon]) => (
                <Link className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-teal-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-teal-700" href={href} key={label}>
                  <Icon className="text-slate-700 transition group-hover:text-teal-700 dark:text-slate-200 dark:group-hover:text-teal-300" size={19} />
                  <h3 className="mt-3 font-semibold">{label}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{helper}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <DashboardList title="Recent Projects" href="/admin/projects" items={recent.projects ?? []} icon={Rocket} />
            <DashboardList title="Recent Inbox" href="/admin/contacts" items={recent.contacts ?? []} icon={Mail} />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <DashboardList title="Recent Blogs" href="/admin/blogs" items={recent.blogs ?? []} icon={BookOpen} />
          <DashboardList title="Recent Certificates" href="/admin/certificates" items={recent.certificates ?? []} icon={Trophy} />
        </section>
      </div>
    </Panel>
  );
}

function SEOHealthPanel({ issues, totalContent }: { issues: SeoIssue[]; totalContent: number }) {
  const critical = issues.filter((issue) => issue.tone === "error").length;
  const warnings = issues.filter((issue) => issue.tone === "warning").length;
  const score = Math.max(0, Math.round(((Math.max(totalContent, 1) * 4 - issues.length) / (Math.max(totalContent, 1) * 4)) * 100));

  return (
    <section className={`${softPanelClass} overflow-hidden`}>
      <div className="grid gap-4 border-b border-slate-200 bg-slate-50/80 p-5 lg:grid-cols-[1fr_auto] lg:items-center dark:border-slate-800 dark:bg-slate-900/70">
        <div>
          <div className="flex items-center gap-2">
            <Search className="text-teal-700 dark:text-teal-300" size={19} />
            <h2 className="text-lg font-semibold">SEO Health</h2>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Checks missing metadata, canonical URLs, OG images, and draft content that can weaken public discoverability.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-2xl font-semibold text-slate-950 dark:text-white">{score}%</p>
            <p className="text-slate-500">Score</p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
            <p className="text-2xl font-semibold">{critical}</p>
            <p>Critical</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
            <p className="text-2xl font-semibold">{warnings}</p>
            <p>Warnings</p>
          </div>
        </div>
      </div>
      <div className="grid gap-3 p-4 lg:grid-cols-2">
        {issues.slice(0, 8).map((issue, index) => {
          const Icon = issue.tone === "error" ? AlertTriangle : issue.tone === "warning" ? FileText : ImageIcon;
          const toneClass = issue.tone === "error"
            ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100"
            : issue.tone === "warning"
              ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100"
              : "border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-100";

          return (
            <Link className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-teal-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-teal-700" href={issue.href} key={`${issue.resource}-${issue.title}-${issue.issue}-${index}`}>
              <div className="flex items-start gap-3">
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl border ${toneClass}`}>
                  <Icon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{issue.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{issue.resource} - {issue.issue}</p>
                </div>
              </div>
            </Link>
          );
        })}
        {issues.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 size={18} /> SEO metadata looks complete.
            </div>
            <p className="mt-1 text-sm opacity-80">Profile, projects, and blogs have the key public metadata fields filled.</p>
          </div>
        ) : null}
      </div>
      {issues.length > 8 ? (
        <div className="border-t border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 dark:border-slate-800">
          Showing 8 of {issues.length} issue(s). Open related resources to complete the rest.
        </div>
      ) : null}
    </section>
  );
}

function DashboardList({
  title,
  href,
  items,
  icon: Icon,
}: {
  title: string;
  href: string;
  items: Array<Record<string, unknown>>;
  icon: IconType;
}) {
  return (
    <section className={`${softPanelClass} p-5`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="text-teal-700 dark:text-teal-300" size={18} />
          <h2 className="font-semibold">{title}</h2>
        </div>
        <Link className="text-sm font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white" href={href}>
          View all
        </Link>
      </div>
      <div className="grid gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <Link className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 transition hover:border-teal-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-teal-700" href={href} key={String(item.id)}>
              <p className="truncate text-sm font-semibold">{String(item.title ?? item.name ?? item.email ?? item.issuer ?? item.company ?? `#${item.id}`)}</p>
              <p className="truncate text-xs text-slate-500">{displaySubtitle(item)}</p>
            </Link>
          ))
        ) : (
          <EmptyState title="No data yet" description="Create content first, then it will appear here." compact />
        )}
      </div>
    </section>
  );
}

function buildSeoIssues(
  profile: Record<string, unknown>,
  projects: Array<Record<string, unknown>>,
  blogs: Array<Record<string, unknown>>,
) {
  const issues: SeoIssue[] = [];

  if (!hasValue(profile.site_description)) {
    issues.push({ title: "Global profile", resource: "Profile", href: "/admin/profile", issue: "Missing site description", tone: "error" });
  }
  if (!hasValue(profile.site_keywords)) {
    issues.push({ title: "Global profile", resource: "Profile", href: "/admin/profile", issue: "Missing site keywords", tone: "warning" });
  }
  if (!hasValue(profile.og_image_url)) {
    issues.push({ title: "Global profile", resource: "Profile", href: "/admin/profile", issue: "Missing global OG image", tone: "warning" });
  }

  projects.forEach((project) => {
    const title = String(project.title ?? `Project #${project.id ?? ""}`);
    if (!hasValue(project.meta_title)) {
      issues.push({ title, resource: "Project", href: "/admin/projects", issue: "Missing meta title", tone: "error" });
    }
    if (!hasValue(project.meta_description)) {
      issues.push({ title, resource: "Project", href: "/admin/projects", issue: "Missing meta description", tone: "error" });
    }
    if (!hasValue(project.og_image_url) && !hasValue(project.thumbnail_url)) {
      issues.push({ title, resource: "Project", href: "/admin/projects", issue: "Missing image/OG image", tone: "warning" });
    }
    if (String(project.status ?? "") !== "published") {
      issues.push({ title, resource: "Project", href: "/admin/projects", issue: "Still in draft", tone: "info" });
    }
  });

  blogs.forEach((blog) => {
    const title = String(blog.title ?? `Blog #${blog.id ?? ""}`);
    if (!hasValue(blog.meta_title)) {
      issues.push({ title, resource: "Blog", href: "/admin/blogs", issue: "Missing meta title", tone: "error" });
    }
    if (!hasValue(blog.meta_description)) {
      issues.push({ title, resource: "Blog", href: "/admin/blogs", issue: "Missing meta description", tone: "error" });
    }
    if (!hasValue(blog.canonical_url)) {
      issues.push({ title, resource: "Blog", href: "/admin/blogs", issue: "Missing canonical URL", tone: "warning" });
    }
    if (!hasValue(blog.og_image_url) && !hasValue(blog.thumbnail_url)) {
      issues.push({ title, resource: "Blog", href: "/admin/blogs", issue: "Missing image/OG image", tone: "warning" });
    }
    if (String(blog.status ?? "") !== "published") {
      issues.push({ title, resource: "Blog", href: "/admin/blogs", issue: "Still in draft", tone: "info" });
    }
  });

  return issues;
}

function hasValue(value: unknown) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

export function ResourcePage({ resourceKey }: { resourceKey: ResourceKey }) {
  const config = resourceConfigs[resourceKey];
  const token = readToken();
  const toast = useAdminToast();
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>(normalizeAdminPayload(config.emptyPayload, "create"));
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<ApiResponse<Array<Record<string, unknown>>>["meta"]>();
  const [saving, setSaving] = useState(false);

  async function load(targetPage = page) {
    const query = new URLSearchParams({ page: String(targetPage), limit: "25" });
    if (search) query.set("search", search);
    const filterParam = adminFilterParam(config.key);
    if (filterParam && filter) query.set(filterParam, filter);
    const res = await adminFetch<Array<Record<string, unknown>>>(`${config.key}?${query.toString()}`, token);
    setItems(res.data ?? []);
    setMeta(res.meta);
    setPage(res.meta?.page ?? targetPage);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(1).catch((err) => setMessage(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.key, token]);

  async function save() {
    setMessage("");
    setSaving(true);
    try {
      const id = selected?.id;
      await adminFetch(`${config.key}${id ? `/${id}` : ""}`, token, {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(formData),
      });
      await revalidateAdminTags(token, tagsForResource(config.key));
      setSelected(null);
      setFormData(normalizeAdminPayload(config.emptyPayload, "create"));
      setModalOpen(false);
      await load();
      setMessage("Saved.");
      toast({
        tone: "success",
        title: id ? `${config.label} updated` : `${config.label} created`,
        description: "Public cache was refreshed automatically.",
      });
    } catch (error) {
      toast({
        tone: "error",
        title: `Failed to save ${config.label.toLowerCase()}`,
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!deleteTarget?.id) return;
    try {
      await adminFetch(`${config.key}/${deleteTarget.id}`, token, { method: "DELETE" });
      await revalidateAdminTags(token, tagsForResource(config.key));
      setDeleteTarget(null);
      await load();
      toast({
        tone: "success",
        title: `${config.label} deleted`,
        description: "The record was removed and cache refresh was queued.",
      });
    } catch (error) {
      toast({
        tone: "error",
        title: `Failed to delete ${config.label.toLowerCase()}`,
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  return (
    <Panel title={config.label} description={config.description}>
      {config.key === "blogs" ? <BlogAdminActions token={token} onDone={load} /> : null}
      <section className={`${softPanelClass} min-w-0 overflow-hidden`}>
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/80 p-4 sm:flex-row dark:border-slate-800 dark:bg-slate-900/70">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={17} />
            <input className={`${controlClass} pl-9`} placeholder={`Search ${config.label.toLowerCase()}`} value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          {adminFilterOptions(config.key).length > 0 ? (
            <select className={`${controlClass} sm:w-48`} value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="">{adminFilterLabel(config.key)}</option>
              {adminFilterOptions(config.key).map((option) => (
                <option key={option} value={option}>
                  {labelize(option)}
                </option>
              ))}
            </select>
          ) : null}
          <button className={secondaryButtonClass} type="button" onClick={() => { setPage(1); void load(1); }}>
            Search
          </button>
          <button
            className={primaryButtonClass}
            type="button"
            onClick={() => {
              setSelected(null);
              setFormData(normalizeAdminPayload(config.emptyPayload, "create"));
              setModalOpen(true);
            }}
          >
            <Plus size={16} /> Create
          </button>
        </div>
        <div className="grid gap-3 p-3 lg:hidden">
          {items.map((item) => (
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/10" key={String(item.id)}>
              <div className="flex gap-3">
                <MediaPreview path={itemMediaPath(item)} compact />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{displayTitle(item)}</p>
                      <p className="truncate text-xs text-slate-500">{displaySubtitle(item)}</p>
                    </div>
                    <StatusPill value={String(item.status ?? item.level ?? item.work_type ?? item.category ?? "active")} />
                  </div>
                  <div className="mt-4 flex gap-2">
                    {publicPreviewHref(config.key, item) ? (
                      <Link className={secondaryButtonClass} href={publicPreviewHref(config.key, item)} target="_blank">
                        <ExternalLink size={15} /> View
                      </Link>
                    ) : null}
                    <button
                      className={secondaryButtonClass}
                      type="button"
                      onClick={() => {
                        setSelected(item);
                        setFormData(normalizeAdminPayload(item, "edit"));
                        setModalOpen(true);
                      }}
                    >
                      <Pencil size={15} /> Edit
                    </button>
                    <button className={dangerButtonClass} type="button" onClick={() => setDeleteTarget(item)}>
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
          {items.length === 0 ? (
            <EmptyState title={`No ${config.label.toLowerCase()} found`} description="Try a different search or create a new record." />
          ) : null}
        </div>
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3">Preview</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Info</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {items.map((item) => (
                <tr className="transition hover:bg-teal-50/50 dark:hover:bg-slate-900" key={String(item.id)}>
                  <td className="px-4 py-3">
                    <MediaPreview path={itemMediaPath(item)} compact />
                  </td>
                  <td className="max-w-[260px] px-4 py-3">
                    <p className="truncate font-semibold">{displayTitle(item)}</p>
                    <p className="truncate text-xs text-slate-500">ID #{String(item.id)}</p>
                  </td>
                  <td className="max-w-[320px] px-4 py-3 text-slate-600 dark:text-slate-300">
                    <p className="truncate">{displaySubtitle(item)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill value={String(item.status ?? item.level ?? item.work_type ?? item.category ?? "active")} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {publicPreviewHref(config.key, item) ? (
                        <Link className={secondaryButtonClass} href={publicPreviewHref(config.key, item)} target="_blank">
                          <ExternalLink size={15} /> View
                        </Link>
                      ) : null}
                      <button
                        className={secondaryButtonClass}
                        type="button"
                        onClick={() => {
                          setSelected(item);
                          setFormData(normalizeAdminPayload(item, "edit"));
                          setModalOpen(true);
                        }}
                      >
                        <Pencil size={15} /> Edit
                      </button>
                      <button className={dangerButtonClass} type="button" onClick={() => setDeleteTarget(item)}>
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 ? (
            <EmptyState title={`No ${config.label.toLowerCase()} found`} description="Try a different search or create a new record." />
          ) : null}
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/80 p-4 text-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-slate-600 dark:text-slate-300">
            Page <span className="font-semibold text-slate-950 dark:text-white">{meta?.page ?? page}</span> of{" "}
            <span className="font-semibold text-slate-950 dark:text-white">{meta?.total_pages ?? 1}</span>
            {typeof meta?.total === "number" ? ` • ${meta.total} records` : ""}
          </p>
          <div className="flex gap-2">
            <button
              className={secondaryButtonClass}
              disabled={(meta?.page ?? page) <= 1}
              type="button"
              onClick={() => {
                const nextPage = Math.max(1, (meta?.page ?? page) - 1);
                setPage(nextPage);
                void load(nextPage);
              }}
            >
              Previous
            </button>
            <button
              className={secondaryButtonClass}
              disabled={(meta?.page ?? page) >= (meta?.total_pages ?? 1)}
              type="button"
              onClick={() => {
                const nextPage = (meta?.page ?? page) + 1;
                setPage(nextPage);
                void load(nextPage);
              }}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {message ? <p className="mt-3 text-sm text-slate-500">{message}</p> : null}

      <ResourceModal
        config={config}
        data={formData}
        fields={resourceFields[config.key]}
        mode={selected ? "edit" : "create"}
        open={modalOpen}
        token={token}
        onClose={() => setModalOpen(false)}
        onChange={setFormData}
        saving={saving}
        onSubmit={save}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${displayTitle(deleteTarget ?? {})}?`}
        description="This action cannot be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </Panel>
  );
}

function ResourceModal({
  open,
  mode,
  config,
  fields,
  data,
  token,
  saving,
  onChange,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  config: ResourceConfig;
  fields: FieldConfig[];
  data: Record<string, unknown>;
  token: string;
  saving: boolean;
  onChange: (data: Record<string, unknown>) => void;
  onClose: () => void;
  onSubmit: () => Promise<void>;
}) {
  const Icon = config.icon;

  function update(name: string, value: unknown) {
    onChange({ ...data, [name]: value });
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            aria-label="Close modal"
            className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.section
            className="fixed inset-x-3 top-4 z-50 mx-auto flex max-h-[calc(100vh-2rem)] max-w-7xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-800 dark:bg-slate-950"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-950 p-4 text-white dark:border-slate-800">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-teal-400 text-slate-950 shadow-lg shadow-teal-950/20">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-semibold">{mode === "create" ? "Create" : "Edit"} {config.label}</h2>
                  <p className="truncate text-xs text-slate-300">{mode === "create" ? "Add a new content item" : displayTitle(data)}</p>
                </div>
              </div>
              <button className="rounded-xl p-2 text-slate-300 hover:bg-white/10" type="button" onClick={onClose}>
                <X size={18} />
              </button>
            </div>
            <form
              className="overflow-y-auto p-4"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
              }}
            >
              <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
                <div className="grid gap-5 md:grid-cols-2">
                  {fields.map((field) => (
                    <AdminField data={data} field={field} key={field.name} token={token} onChange={update} />
                  ))}
                </div>
                <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                  <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-300">Record Preview</p>
                  <div className="mt-4">
                    <MediaPreview path={itemMediaPath(data)} />
                  </div>
                  <h3 className="mt-4 line-clamp-2 font-semibold">{displayTitle(data)}</h3>
                  <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-500">{displaySubtitle(data) || "Fill the form to preview this record."}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <StatusPill value={String(data.status ?? data.level ?? data.work_type ?? data.category ?? "draft")} />
                    {data.featured ? <StatusPill value="Featured" /> : null}
                  </div>
                  {publicPreviewHref(config.key, data) ? (
                    <Link className={`${secondaryButtonClass} mt-4 w-full`} href={publicPreviewHref(config.key, data)} target="_blank">
                      <ExternalLink size={15} /> View public page
                    </Link>
                  ) : null}
                </aside>
              </div>
              <div className="sticky bottom-0 mt-6 flex justify-end gap-2 border-t border-slate-200 bg-white/95 pt-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
                <button className={secondaryButtonClass} type="button" onClick={onClose}>
                  Cancel
                </button>
                <button className={primaryButtonClass} disabled={saving} type="submit">
                  <Save size={16} /> {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function AdminField({
  field,
  data,
  token,
  onChange,
}: {
  field: FieldConfig;
  data: Record<string, unknown>;
  token: string;
  onChange: (name: string, value: unknown) => void;
}) {
  const value = data[field.name];
  const commonClass = controlClass;
  const toast = useAdminToast();
  const mediaField = field.name.includes("image") || field.name.includes("logo") || field.name.includes("favicon") || field.name.includes("thumbnail") || field.name.includes("avatar") || field.name.includes("resume");
  const wide = field.type === "textarea" || field.type === "tags" || mediaField;
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerResolver = useRef<((path: string) => void) | null>(null);

  function pickExistingMedia() {
    setPickerOpen(true);
    return new Promise<string>((resolve) => {
      pickerResolver.current = resolve;
    });
  }

  function resolvePickedMedia(path: string) {
    if (pickerResolver.current) {
      pickerResolver.current(path);
      pickerResolver.current = null;
    } else {
      onChange(field.name, path);
    }
    setPickerOpen(false);
  }

  function closePicker() {
    if (pickerResolver.current) {
      pickerResolver.current("");
      pickerResolver.current = null;
    }
    setPickerOpen(false);
  }

  async function upload(file: File) {
    setUploadError("");
    setUploading(true);
    try {
      const path = await uploadMediaFile(file, token);
      onChange(field.name, path);
      toast({ tone: "success", title: "File uploaded", description: path });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
      toast({
        tone: "error",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try another file.",
      });
    } finally {
      setUploading(false);
    }
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/10">
        <span>{field.label}</span>
        <input checked={Boolean(value)} className="size-4 accent-teal-600" type="checkbox" onChange={(event) => onChange(field.name, event.target.checked)} />
      </label>
    );
  }

  return (
    <div className={`grid gap-2 text-sm font-medium ${wide ? "md:col-span-2" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <span>{field.label}</span>
        {field.required ? <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">Required</span> : null}
      </div>
      {field.type === "textarea" ? (
        isRichField(field.name) ? (
          <>
            <RichTextEditor
              required={field.required}
              token={token}
              value={String(value ?? "")}
              onChange={(next) => onChange(field.name, next)}
              onPickImage={pickExistingMedia}
              onUpload={async (file, accessToken) => {
                const path = await uploadMediaFile(file, accessToken);
                toast({ tone: "success", title: "Image inserted", description: path });
                return path;
              }}
            />
            <MediaPickerModal accept="image" open={pickerOpen} token={token} onClose={closePicker} onSelect={resolvePickedMedia} />
          </>
        ) : (
          <textarea className={`${commonClass} min-h-32 resize-y leading-7`} required={field.required} value={String(value ?? "")} onChange={(event) => onChange(field.name, event.target.value)} />
        )
      ) : field.type === "select" ? (
        <select className={commonClass} required={field.required} value={String(value ?? field.options?.[0] ?? "")} onChange={(event) => onChange(field.name, event.target.value)}>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {labelize(option)}
            </option>
          ))}
        </select>
      ) : field.type === "tags" ? (
        <input className={commonClass} value={(Array.isArray(value) ? value : []).join(", ")} placeholder="Separate with comma" onChange={(event) => onChange(field.name, event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} />
      ) : mediaField ? (
        <>
          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
            <MediaPreview path={value} />
            <div className="grid gap-2 xl:grid-cols-[1fr_auto_auto]">
              <input className={commonClass} type="text" value={String(value ?? "")} placeholder="Uploaded path will appear here" onChange={(event) => onChange(field.name, event.target.value)} />
              <button className={secondaryButtonClass} type="button" onClick={() => setPickerOpen(true)}>
                <ImageIcon size={16} /> Pick
              </button>
              <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-300 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-teal-600">
                <ImageUp size={16} />
                {uploading ? "Uploading..." : "Upload"}
                <input
                  className="hidden"
                  disabled={uploading}
                  type="file"
                  accept={field.name.includes("resume") ? ".pdf,image/*" : "image/*"}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) upload(file);
                    event.target.value = "";
                  }}
                />
              </label>
            </div>
            {uploadError ? <p className="text-xs font-medium text-red-600 dark:text-red-400">{uploadError}</p> : null}
          </div>
          <MediaPickerModal
            accept={field.name.includes("resume") ? "all" : "image"}
            open={pickerOpen}
            token={token}
            onClose={closePicker}
            onSelect={(path) => {
              onChange(field.name, path);
              resolvePickedMedia(path);
            }}
          />
        </>
      ) : (
        <input className={commonClass} required={field.required} type={field.type} value={String(value ?? "")} onChange={(event) => onChange(field.name, field.type === "number" ? Number(event.target.value) : event.target.value)} />
      )}
    </div>
  );
}

function isRichField(name: string) {
  return ["content", "description", "bio", "summary"].some((key) => name.includes(key));
}

function MediaPickerModal({
  open,
  token,
  accept,
  onClose,
  onSelect,
}: {
  open: boolean;
  token: string;
  accept: "image" | "all";
  onClose: () => void;
  onSelect: (path: string) => void;
}) {
  const toast = useAdminToast();
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch<Array<Record<string, unknown>>>("media?limit=100", token);
      setItems(res.data ?? []);
    } catch (error) {
      toast({ tone: "error", title: "Failed to load media", description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      void loadMedia();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, loadMedia]);

  const filtered = items.filter((item) => {
    const path = String(item.file_path ?? "");
    const name = String(item.original_name ?? item.file_name ?? "");
    const mime = String(item.mime_type ?? "");
    if (accept === "image" && !mime.startsWith("image/") && !isImagePath(path)) return false;
    if (!search) return true;
    const needle = search.toLowerCase();
    return path.toLowerCase().includes(needle) || name.toLowerCase().includes(needle);
  });

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-sm" type="button" aria-label="Close media picker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.section
            className="fixed inset-x-3 top-6 z-[71] mx-auto flex max-h-[calc(100vh-3rem)] max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/30 dark:border-slate-800 dark:bg-slate-950"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
          >
            <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-950 p-4 text-white sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <div>
                <h2 className="font-semibold">Pick Existing Media</h2>
                <p className="text-xs text-slate-300">Choose an uploaded asset from the media library.</p>
              </div>
              <button className="rounded-xl p-2 text-slate-300 hover:bg-white/10" type="button" onClick={onClose}>
                <X size={18} />
              </button>
            </div>
            <div className="border-b border-slate-200 p-4 dark:border-slate-800">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={17} />
                <input className={`${controlClass} pl-9`} placeholder="Search media by name or path" value={search} onChange={(event) => setSearch(event.target.value)} />
              </div>
            </div>
            <div className="min-h-0 overflow-y-auto p-4">
              {loading ? (
                <div className="grid min-h-48 place-items-center text-sm text-slate-500">Loading media...</div>
              ) : filtered.length === 0 ? (
                <EmptyState title="No media found" description="Upload assets in Media first, then they will appear here." />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {filtered.map((item) => {
                    const path = String(item.file_path ?? "");
                    return (
                      <button
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-600"
                        key={String(item.id ?? path)}
                        type="button"
                        onClick={() => onSelect(path)}
                      >
                        <MediaPreview path={path} />
                        <div className="p-3">
                          <p className="truncate text-sm font-semibold">{String(item.original_name ?? item.file_name ?? "Media")}</p>
                          <p className="mt-1 truncate text-xs text-slate-500">{path}</p>
                          <p className="mt-2 text-xs text-slate-400">{String(item.mime_type ?? "")}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function MediaPreview({ path, compact = false }: { path?: unknown; compact?: boolean }) {
  const raw = String(path ?? "");
  const src = publicAssetUrl(raw);

  if (!raw) {
    return <div className={`${compact ? "size-12" : "h-28"} grid place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900`}><ImageIcon size={compact ? 16 : 22} /></div>;
  }

  if (isImagePath(raw)) {
    return (
      <div className={`${compact ? "size-12" : "h-44 w-full"} relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-900`}>
        <Image alt="Media preview" className="object-cover" fill sizes={compact ? "48px" : "320px"} src={src} unoptimized />
      </div>
    );
  }

  return (
    <a className="inline-flex max-w-full truncate rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm hover:border-teal-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300" href={src} rel="noreferrer" target="_blank">
      View file
    </a>
  );
}

function ConfirmDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm" type="button" aria-label="Cancel delete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel} />
          <motion.section className="fixed inset-x-4 top-24 z-50 mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
            <div className="flex gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-300">
                <Trash2 size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button className={secondaryButtonClass} type="button" onClick={onCancel}>Cancel</button>
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700" type="button" onClick={onConfirm}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function StatusPill({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  const tone = normalized === "published" || normalized === "expert" || normalized === "advanced" || normalized === "featured"
    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
    : normalized === "draft" || normalized === "pending"
      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
      : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tone}`}>{value}</span>;
}

function EmptyState({ title, description, compact = false }: { title: string; description: string; compact?: boolean }) {
  return (
    <div className={`grid place-items-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 text-center dark:border-slate-800 dark:bg-slate-900/50 ${compact ? "px-3 py-6" : "m-3 px-6 py-10"}`}>
      <div className="grid max-w-sm gap-2">
        <div className="mx-auto grid size-10 place-items-center rounded-xl bg-white text-slate-500 shadow-sm dark:bg-slate-950 dark:text-slate-400">
          <FileText size={18} />
        </div>
        <p className="font-semibold text-slate-800 dark:text-slate-100">{title}</p>
        <p className="text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function displayTitle(item: Record<string, unknown>) {
  return String(item.title ?? item.name ?? item.company ?? item.institution ?? item.issuer ?? item.email ?? `#${item.id ?? ""}`);
}

function displaySubtitle(item: Record<string, unknown>) {
  return plainText(item.summary ?? item.description ?? item.content ?? item.category ?? item.position ?? item.field ?? item.message ?? item.status ?? "");
}

function plainText(value: unknown) {
  return String(value ?? "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function ProfilePage() {
  const token = readToken();
  const toast = useAdminToast();
  const [profile, setProfile] = useState<Record<string, unknown>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    adminFetch<Record<string, unknown>>("profile", token)
      .then((res) => setProfile(normalizeAdminPayload(res.data ?? {}, "edit")))
      .catch((err) => setMessage(err.message));
  }, [token]);

  async function save() {
    try {
      await adminFetch("profile", token, { method: "PUT", body: JSON.stringify(profile) });
      await revalidateAdminTags(token, ["profile"]);
      setMessage("Profile saved.");
      toast({ tone: "success", title: "Profile saved", description: "Public profile cache was refreshed automatically." });
    } catch (error) {
      toast({
        tone: "error",
        title: "Failed to save profile",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  return (
    <Panel title="Profile & SEO" description="Singleton profile row, global SEO fallback, social links, logo, favicon, and public status.">
      <section className={`${softPanelClass} p-5`}>
        <div className="grid gap-4 md:grid-cols-2">
          {profileFields.map((field) => (
            <AdminField data={profile} field={field} key={field.name} token={token} onChange={(name, value) => setProfile((current) => ({ ...current, [name]: value }))} />
          ))}
        </div>
      </section>
      <button className={`${primaryButtonClass} mt-4`} type="button" onClick={save}>
        <Save size={16} /> Save profile
      </button>
      {message ? <p className="mt-3 text-sm text-slate-500">{message}</p> : null}
    </Panel>
  );
}

const seoFields: FieldConfig[] = [
  { name: "path", label: "Public Path", type: "text", required: true },
  { name: "title", label: "SEO Title", type: "text", required: true },
  { name: "description", label: "Meta Description", type: "textarea", required: true },
  { name: "canonical_path", label: "Canonical Path", type: "text", required: true },
  { name: "og_image_url", label: "Open Graph Image", type: "text" },
  { name: "keywords", label: "Keywords", type: "tags" },
  { name: "schema_type", label: "Schema Type", type: "select", options: ["WebSite", "WebPage", "AboutPage", "CollectionPage", "Blog", "ContactPage", "SearchResultsPage"] },
  { name: "breadcrumb_label", label: "Breadcrumb Label", type: "text", required: true },
  { name: "robots_index", label: "Allow Indexing", type: "checkbox" },
  { name: "robots_follow", label: "Allow Following Links", type: "checkbox" },
];

export function SEOSettingsPage() {
  const token = readToken();
  const toast = useAdminToast();
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    const res = await adminFetch<Array<Record<string, unknown>>>(`seo-settings${query.size ? `?${query.toString()}` : ""}`, token);
    const nextItems = res.data ?? [];
    setItems(nextItems);
    const nextSelected = nextItems.find((item) => String(item.key) === selectedKey) ?? nextItems[0];
    setSelectedKey(String(nextSelected?.key ?? ""));
    setFormData(normalizeAdminPayload(nextSelected ?? {}, "edit"));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load().catch((error) => toast({ tone: "error", title: "Failed to load SEO settings", description: error instanceof Error ? error.message : "Please try again." }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function save() {
    if (!selectedKey) return;
    setSaving(true);
    try {
      await adminFetch(`seo-settings/${selectedKey}`, token, { method: "PUT", body: JSON.stringify(formData) });
      await revalidateAdminTags(token, ["seo", "profile"]);
      await load();
      toast({ tone: "success", title: "SEO setting saved", description: "Metadata cache was refreshed automatically." });
    } catch (error) {
      toast({ tone: "error", title: "Failed to save SEO", description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel title="SEO Settings" description="Edit page-level metadata consumed by the public frontend. Global logo, favicon, and site defaults still live in Profile.">
      <div className="grid gap-5 xl:grid-cols-[280px_1fr]">
        <section className={`${softPanelClass} overflow-hidden`}>
          <div className="border-b border-slate-200 p-3 dark:border-slate-800">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={17} />
              <input className={`${controlClass} pl-9`} placeholder="Search page SEO" value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <button className={`${secondaryButtonClass} mt-2 w-full`} type="button" onClick={() => void load()}>
              Search
            </button>
          </div>
          <div className="grid max-h-[560px] gap-1 overflow-y-auto p-2">
            {items.map((item) => {
              const active = String(item.key) === selectedKey;
              return (
                <button
                  className={`rounded-2xl px-3 py-3 text-left transition ${active ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950" : "hover:bg-slate-100 dark:hover:bg-slate-900"}`}
                  key={String(item.key)}
                  type="button"
                  onClick={() => {
                    setSelectedKey(String(item.key));
                    setFormData(normalizeAdminPayload(item, "edit"));
                  }}
                >
                  <p className="font-semibold">{labelize(String(item.key))}</p>
                  <p className={`mt-1 truncate text-xs ${active ? "text-slate-300 dark:text-slate-600" : "text-slate-500"}`}>{String(item.path)}</p>
                </button>
              );
            })}
            {items.length === 0 ? <EmptyState compact title="No SEO pages" description="Search did not match any SEO setting." /> : null}
          </div>
        </section>

        <section className={`${softPanelClass} p-5`}>
          <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between dark:border-slate-800">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-300">Page metadata</p>
              <h2 className="mt-2 text-2xl font-semibold">{labelize(String(formData.key ?? "SEO"))}</h2>
              <p className="mt-1 text-sm text-slate-500">Title, canonical, robots, schema, image, and keywords for this route.</p>
            </div>
            <button className={primaryButtonClass} disabled={saving || !selectedKey} type="button" onClick={save}>
              <Save size={16} /> {saving ? "Saving..." : "Save SEO"}
            </button>
          </div>
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="grid gap-4 md:grid-cols-2">
              {seoFields.map((field) => (
                <AdminField data={formData} field={field} key={field.name} token={token} onChange={(name, value) => setFormData((current) => ({ ...current, [name]: value }))} />
              ))}
            </div>
            <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-300">Search Preview</p>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <p className="truncate text-xs text-emerald-700 dark:text-emerald-300">{String(formData.canonical_path ?? formData.path ?? "/")}</p>
                <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-blue-700 dark:text-blue-300">{String(formData.title ?? "")}</h3>
                <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{String(formData.description ?? "")}</p>
              </div>
              <div className="mt-4">
                <MediaPreview path={formData.og_image_url} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusPill value={formData.robots_index ? "Index" : "Noindex"} />
                <StatusPill value={formData.robots_follow ? "Follow" : "Nofollow"} />
                <StatusPill value={String(formData.schema_type ?? "WebPage")} />
              </div>
            </aside>
          </div>
        </section>
      </div>
    </Panel>
  );
}

const userFields: FieldConfig[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "text", required: true },
  { name: "password", label: "New Password", type: "text" },
];

export function UsersPage() {
  const token = readToken();
  const toast = useAdminToast();
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({ name: "", email: "", password: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<ApiResponse<Array<Record<string, unknown>>>["meta"]>();
  const [saving, setSaving] = useState(false);

  async function load(targetPage = page) {
    const query = new URLSearchParams({ page: String(targetPage), limit: "20" });
    if (search) query.set("search", search);
    const res = await adminFetch<Array<Record<string, unknown>>>(`users?${query.toString()}`, token);
    setItems(res.data ?? []);
    setMeta(res.meta);
    setPage(res.meta?.page ?? targetPage);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(1).catch((error) => toast({ tone: "error", title: "Failed to load users", description: error instanceof Error ? error.message : "Please try again." }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function save() {
    setSaving(true);
    try {
      const id = selected?.id;
      const payload = { ...formData };
      if (id && !String(payload.password ?? "").trim()) delete payload.password;
      delete payload.role;
      await adminFetch(`users${id ? `/${id}` : ""}`, token, { method: id ? "PUT" : "POST", body: JSON.stringify(payload) });
      setModalOpen(false);
      setSelected(null);
      await load();
      toast({ tone: "success", title: id ? "User updated" : "User created", description: "Admin credential data was saved." });
    } catch (error) {
      toast({ tone: "error", title: "Failed to save user", description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!deleteTarget?.id) return;
    try {
      await adminFetch(`users/${deleteTarget.id}`, token, { method: "DELETE" });
      setDeleteTarget(null);
      await load();
      toast({ tone: "success", title: "User deleted" });
    } catch (error) {
      toast({ tone: "error", title: "Failed to delete user", description: error instanceof Error ? error.message : "Please try again." });
    }
  }

  return (
    <Panel title="Admin Users" description="Manage deploy-ready admin accounts and rotate passwords without touching the database manually.">
      <section className={`${softPanelClass} overflow-hidden`}>
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/80 p-4 sm:flex-row dark:border-slate-800 dark:bg-slate-900/70">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={17} />
            <input className={`${controlClass} pl-9`} placeholder="Search users" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <button className={secondaryButtonClass} type="button" onClick={() => { setPage(1); void load(1); }}>
            Search
          </button>
          <button
            className={primaryButtonClass}
            type="button"
            onClick={() => {
              setSelected(null);
              setFormData({ name: "", email: "", password: "" });
              setModalOpen(true);
            }}
          >
            <Plus size={16} /> Create User
          </button>
        </div>

        <div className="grid gap-3 p-3 lg:grid-cols-2">
          {items.map((item) => (
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/10" key={String(item.id)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                    <Shield size={18} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold">{String(item.name)}</h2>
                    <p className="truncate text-sm text-slate-500">{String(item.email)}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-300">Admin account</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    className={secondaryButtonClass}
                    type="button"
                    onClick={() => {
                      setSelected(item);
                      setFormData({ name: item.name, email: item.email, password: "" });
                      setModalOpen(true);
                    }}
                  >
                    <Pencil size={15} /> Edit
                  </button>
                  <button className={dangerButtonClass} type="button" onClick={() => setDeleteTarget(item)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
          {items.length === 0 ? <EmptyState title="No users found" description="Try a different search or create a new admin user." /> : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/80 p-4 text-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-slate-600 dark:text-slate-300">
            Page <span className="font-semibold text-slate-950 dark:text-white">{meta?.page ?? page}</span> of <span className="font-semibold text-slate-950 dark:text-white">{meta?.total_pages ?? 1}</span>
          </p>
          <div className="flex gap-2">
            <button className={secondaryButtonClass} disabled={(meta?.page ?? page) <= 1} type="button" onClick={() => { const nextPage = Math.max(1, (meta?.page ?? page) - 1); setPage(nextPage); void load(nextPage); }}>
              Previous
            </button>
            <button className={secondaryButtonClass} disabled={(meta?.page ?? page) >= (meta?.total_pages ?? 1)} type="button" onClick={() => { const nextPage = (meta?.page ?? page) + 1; setPage(nextPage); void load(nextPage); }}>
              Next
            </button>
          </div>
        </div>
      </section>

      <SimpleFormModal
        icon={Users}
        title={selected ? "Edit Admin User" : "Create Admin User"}
        description={selected ? "Leave password empty if you do not want to rotate it." : "Use a strong password before deploying."}
        fields={userFields}
        data={formData}
        token={token}
        open={modalOpen}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onChange={(name, value) => setFormData((current) => ({ ...current, [name]: value }))}
        onSubmit={save}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${displayTitle(deleteTarget ?? {})}?`}
        description="You cannot delete the last admin user."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </Panel>
  );
}

function SimpleFormModal({
  open,
  icon: Icon,
  title,
  description,
  fields,
  data,
  token,
  saving,
  onClose,
  onChange,
  onSubmit,
}: {
  open: boolean;
  icon: IconType;
  title: string;
  description: string;
  fields: FieldConfig[];
  data: Record<string, unknown>;
  token: string;
  saving: boolean;
  onClose: () => void;
  onChange: (name: string, value: unknown) => void;
  onSubmit: () => Promise<void>;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm" type="button" aria-label="Close modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.section className="fixed inset-x-3 top-8 z-50 mx-auto max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-800 dark:bg-slate-950" initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }}>
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-950 p-4 text-white dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-teal-400 text-slate-950">
                  <Icon size={18} />
                </div>
                <div>
                  <h2 className="font-semibold">{title}</h2>
                  <p className="text-xs text-slate-300">{description}</p>
                </div>
              </div>
              <button className="rounded-xl p-2 text-slate-300 hover:bg-white/10" type="button" onClick={onClose}>
                <X size={18} />
              </button>
            </div>
            <form
              className="grid gap-4 p-5"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
              }}
            >
              {fields.map((field) => (
                <AdminField data={data} field={field} key={field.name} token={token} onChange={onChange} />
              ))}
              <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
                <button className={secondaryButtonClass} type="button" onClick={onClose}>
                  Cancel
                </button>
                <button className={primaryButtonClass} disabled={saving} type="submit">
                  <Save size={16} /> {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function labelize(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function adminFilterParam(key: ResourceKey) {
  if (key === "blogs" || key === "projects") return "status";
  if (key === "skills") return "category";
  return "";
}

function adminFilterLabel(key: ResourceKey) {
  if (key === "blogs" || key === "projects") return "All statuses";
  if (key === "skills") return "All categories";
  return "All";
}

function adminFilterOptions(key: ResourceKey) {
  if (key === "blogs" || key === "projects") return ["draft", "published"];
  if (key === "skills") return ["Frontend", "Backend", "Database", "AI/ML", "Cloud", "DevOps", "Design", "Tooling"];
  return [];
}

export function ContactsPage() {
  const token = readToken();
  const toast = useAdminToast();
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<ApiResponse<Array<Record<string, unknown>>>["meta"]>();

  async function load(targetPage = page) {
    const query = new URLSearchParams({ page: String(targetPage), limit: "20" });
    if (search) query.set("search", search);
    if (readFilter) query.set("read", readFilter);
    const res = await adminFetch<Array<Record<string, unknown>>>(`contacts?${query.toString()}`, token);
    setItems(res.data ?? []);
    setMeta(res.meta);
    setPage(res.meta?.page ?? targetPage);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function markRead(id: unknown) {
    try {
      await adminFetch(`contacts/${id}/read`, token, { method: "PUT" });
      await load();
      toast({ tone: "success", title: "Message marked as read" });
    } catch (error) {
      toast({ tone: "error", title: "Failed to update message", description: error instanceof Error ? error.message : "Please try again." });
    }
  }

  async function deleteContact(id: unknown) {
    try {
      await adminFetch(`contacts/${id}`, token, { method: "DELETE" });
      await load();
      toast({ tone: "success", title: "Message deleted" });
    } catch (error) {
      toast({ tone: "error", title: "Failed to delete message", description: error instanceof Error ? error.message : "Please try again." });
    }
  }

  return (
    <Panel title="Inbox" description="Messages submitted from the public contact form.">
      <section className={`${softPanelClass} mb-5 flex flex-col gap-3 p-4 sm:flex-row`}>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={17} />
          <input className={`${controlClass} pl-9`} placeholder="Search inbox" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <select className={`${controlClass} sm:w-44`} value={readFilter} onChange={(event) => setReadFilter(event.target.value)}>
          <option value="">All messages</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>
        <button className={secondaryButtonClass} type="button" onClick={() => { setPage(1); void load(1); }}>
          Search
        </button>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <article className={`${softPanelClass} p-5`} key={String(item.id)}>
            <div className="flex flex-col gap-4">
              <div className="min-w-0">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{String(item.name)}</h2>
                    <a className="break-all text-sm text-teal-700 hover:underline dark:text-teal-300" href={`mailto:${String(item.email)}`}>
                      {String(item.email)}
                    </a>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.is_read ? "bg-slate-100 text-slate-500 dark:bg-slate-900" : "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200"}`}>
                    {item.is_read ? "Read" : "New"}
                  </span>
                </div>
                <p className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:bg-slate-900 dark:text-slate-200">{String(item.message)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className={secondaryButtonClass} type="button" onClick={() => markRead(item.id)}>
                  <CheckCircle2 size={16} /> Read
                </button>
                <a className={secondaryButtonClass} href={`mailto:${String(item.email)}`}>
                  Reply
                </a>
                <button className={dangerButtonClass} type="button" onClick={() => deleteContact(item.id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </article>
        ))}
        {items.length === 0 ? <EmptyState title="Inbox is empty" description="New contact messages from the public site will appear here." /> : null}
      </div>
      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950">
        <p className="text-slate-600 dark:text-slate-300">
          Page <span className="font-semibold text-slate-950 dark:text-white">{meta?.page ?? page}</span> of{" "}
          <span className="font-semibold text-slate-950 dark:text-white">{meta?.total_pages ?? 1}</span>
        </p>
        <div className="flex gap-2">
          <button className={secondaryButtonClass} disabled={(meta?.page ?? page) <= 1} type="button" onClick={() => { const nextPage = Math.max(1, (meta?.page ?? page) - 1); setPage(nextPage); void load(nextPage); }}>
            Previous
          </button>
          <button className={secondaryButtonClass} disabled={(meta?.page ?? page) >= (meta?.total_pages ?? 1)} type="button" onClick={() => { const nextPage = (meta?.page ?? page) + 1; setPage(nextPage); void load(nextPage); }}>
            Next
          </button>
        </div>
      </div>
    </Panel>
  );
}

export function GeneratePage() {
  const token = readToken();
  const toast = useAdminToast();
  const [jobs, setJobs] = useState<Array<{ id: string; status: string; event?: string }>>(() => readStoredGenerateJobs());
  const [events, setEvents] = useState<string[]>(() => readStoredGenerateJobs().map((job) => `Restored job ${job.id}`));
  const loading = jobs.some((job) => job.status !== "done" && job.status !== "error");
  const jobsRef = useRef(jobs);

  useEffect(() => {
    jobsRef.current = jobs;
  }, [jobs]);

  useEffect(() => {
    writeStoredGenerateJobs(jobs);
  }, [jobs]);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const poll = async () => {
      const currentJobs = jobsRef.current;
      if (!currentJobs.some((job) => job.status !== "done" && job.status !== "error")) return;

      const nextJobs = await Promise.all(currentJobs.map(async (job) => {
        if (job.status === "done" || job.status === "error") return job;
        const res = await adminFetch<{ job_id: string; status: string; event: string; data?: unknown }>(`blogs/generate/jobs/${job.id}`, token).catch(() => null);
        if (!res?.data) return job;
        setEvents((current) => appendProgressLine(current, job.id, res.data?.event ?? res.data?.status, res.data?.data));
        return { id: job.id, status: res.data.status, event: res.data.event };
      }));

      if (cancelled) return;
      setJobs(nextJobs);
      if (nextJobs.some((job) => job.status !== "done" && job.status !== "error")) {
        timer = window.setTimeout(poll, 5000);
      }
    };

    timer = window.setTimeout(poll, 800);
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [token]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEvents([]);
    const form = new FormData(event.currentTarget);
    try {
      const response = await adminFetch<{ job_id: string; status: string }>("blogs/generate", token, {
        method: "POST",
        body: JSON.stringify({
        keyword: String(form.get("keyword") ?? ""),
        title: String(form.get("title") ?? ""),
        language: String(form.get("language") ?? "id"),
      }),
      });
      const jobID = response.data?.job_id ?? "";
      setJobs(jobID ? [{ id: jobID, status: "queued" }] : []);
      setEvents(jobID ? [`Queued job ${jobID}`] : []);
      toast({ tone: "success", title: "Draft generation queued", description: jobID });
    } catch (error) {
      toast({ tone: "error", title: "Generate failed", description: error instanceof Error ? error.message : "Please try again." });
    }
  }

  async function submitBatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEvents([]);
    const form = new FormData(event.currentTarget);
    const language = String(form.get("language") ?? "id");
    const raw = String(form.get("items") ?? "");
    const items = raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 10)
      .map((line) => {
        const [keyword, title] = line.split("|").map((part) => part.trim());
        return { keyword: keyword ?? "", title: title ?? "", language };
      });

    try {
      const response = await adminFetch<{ batch_id: string; job_ids: string[]; total_jobs: number }>("blogs/generate/batch", token, {
        method: "POST",
        body: JSON.stringify({ items }),
      });
      const jobIDs = response.data?.job_ids ?? [];
      setJobs(jobIDs.map((id) => ({ id, status: "queued" })));
      setEvents(jobIDs.map((id) => `Queued job ${id}`));
      toast({ tone: "success", title: "Batch generation queued", description: `${jobIDs.length} draft request(s) queued.` });
    } catch (error) {
      toast({ tone: "error", title: "Batch generate failed", description: error instanceof Error ? error.message : "Please try again." });
    }
  }

  return (
    <Panel title="AI Blog Generate" description="Generate a draft blog using the guarded backend flow and SSE progress.">
      <div className="grid gap-5 xl:grid-cols-2">
        <form className={`${softPanelClass} grid gap-4 p-5`} onSubmit={submit}>
          <div>
            <h2 className="font-semibold">Single Draft</h2>
            <p className="mt-1 text-sm text-slate-500">Generate one article draft from a focused keyword.</p>
          </div>
          <input className={controlClass} name="keyword" placeholder="Keyword" />
          <input className={controlClass} name="title" placeholder="Title" />
          <select className={controlClass} name="language" defaultValue="id">
            <option value="id">Indonesian</option>
            <option value="en">English</option>
          </select>
          <button className={primaryButtonClass} disabled={loading} type="submit">
            <Sparkles size={16} /> {loading ? "Generating" : "Generate draft"}
          </button>
        </form>
        <form className={`${softPanelClass} grid gap-4 p-5`} onSubmit={submitBatch}>
          <div>
            <h2 className="font-semibold">Batch Drafts</h2>
            <p className="mt-1 text-sm text-slate-500">Queue up to 10 drafts, one keyword per line.</p>
          </div>
          <textarea className={`${controlClass} min-h-36 resize-y font-mono leading-6`} name="items" placeholder={"keyword | optional title\nnext keyword | next title"} required />
          <select className={controlClass} name="language" defaultValue="id">
            <option value="id">Indonesian</option>
            <option value="en">English</option>
          </select>
          <button className={primaryButtonClass} disabled={loading} type="submit">
            <Sparkles size={16} /> {loading ? "Generating" : "Generate batch"}
          </button>
        </form>
      </div>
      <section className={`${softPanelClass} mt-5 overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles size={16} /> Progress
          </div>
          <StatusPill value={loading ? "Running" : "Idle"} />
        </div>
        <pre className="max-h-[460px] overflow-auto bg-slate-950 p-4 text-xs leading-6 text-slate-100">
          {events.join("\n") || "Job progress will appear here. You can leave this page and come back while the server keeps running."}
        </pre>
      </section>
    </Panel>
  );
}

function appendProgressLine(lines: string[], jobID: string, event?: string, data?: unknown) {
  const line = `[${jobID.slice(0, 8)}] ${event ?? "processing"}${data ? ` ${JSON.stringify(data)}` : ""}`;
  if (lines[lines.length - 1] === line) return lines;
  return [...lines, line].slice(-100);
}

const generateJobsStorageKey = "admin_blog_generate_jobs";

function readStoredGenerateJobs() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(generateJobsStorageKey) ?? "[]") as Array<{ id?: string; status?: string; event?: string }>;
    return parsed
      .filter((job) => job.id)
      .map((job) => ({ id: String(job.id), status: String(job.status ?? "queued"), event: job.event }))
      .slice(-20);
  } catch {
    return [];
  }
}

function writeStoredGenerateJobs(jobs: Array<{ id: string; status: string; event?: string }>) {
  if (typeof window === "undefined") return;
  const activeOrRecent = jobs.filter((job) => job.status !== "error").slice(-20);
  window.localStorage.setItem(generateJobsStorageKey, JSON.stringify(activeOrRecent));
}

function BlogAdminActions({ token, onDone }: { token: string; onDone: () => Promise<void> }) {
  const toast = useAdminToast();
  const [blogID, setBlogID] = useState("");
  const [message, setMessage] = useState("");

  async function generateSEO() {
    setMessage("");
    try {
      await adminFetch(`blogs/${blogID}/generate-seo`, token, { method: "POST", body: "{}" });
      await onDone();
      setMessage("SEO generated.");
      toast({ tone: "success", title: "SEO generated", description: `Blog #${blogID} metadata was updated.` });
    } catch (error) {
      toast({ tone: "error", title: "SEO generation failed", description: error instanceof Error ? error.message : "Please try again." });
    }
  }

  return (
    <section className={`${softPanelClass} mb-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center`}>
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold">Blog Tools</h2>
        <p className="text-sm text-slate-500">Generate AI SEO metadata for an existing blog ID.</p>
      </div>
      <input className={`${controlClass} sm:w-32`} placeholder="Blog ID" value={blogID} onChange={(event) => setBlogID(event.target.value)} />
      <button className={primaryButtonClass} disabled={!blogID} type="button" onClick={generateSEO}>
        <Sparkles size={16} /> Generate SEO
      </button>
      {message ? <p className="text-sm text-slate-500">{message}</p> : null}
    </section>
  );
}

export function RevalidatePage() {
  const token = readToken();
  const toast = useAdminToast();
  const [tags, setTags] = useState("profile\nprojects\nblogs\ncertificates\nexperiences\neducations\nskills");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const tagList = tags.split(/\s+/).map((tag) => tag.trim()).filter(Boolean);
    try {
      await adminFetch("revalidate", token, {
        method: "POST",
        body: JSON.stringify({ tags: tagList }),
      });
      setMessage(`Queued ${tagList.length} tag(s).`);
      toast({ tone: "success", title: "Revalidation queued", description: `${tagList.length} tag(s) requested.` });
    } catch (error) {
      toast({ tone: "error", title: "Revalidate failed", description: error instanceof Error ? error.message : "Please try again." });
    }
  }

  return (
    <Panel title="Revalidate" description="Content saves already revalidate automatically. Use this only when you need to refresh selected tags manually.">
      <form className={`${softPanelClass} p-5`} onSubmit={submit}>
        <textarea className={`${controlClass} min-h-48 resize-y font-mono leading-6`} value={tags} onChange={(event) => setTags(event.target.value)} />
        <button className={`${primaryButtonClass} mt-3`} type="submit">
          <RefreshCw size={16} /> Revalidate
        </button>
        {message ? <p className="mt-3 text-sm text-slate-500">{message}</p> : null}
      </form>
    </Panel>
  );
}

export function MediaPage() {
  const token = readToken();
  const toast = useAdminToast();
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  async function load() {
    const res = await adminFetch<Array<Record<string, unknown>>>("media?limit=50", token);
    setItems(res.data ?? []);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load().catch((err) => setMessage(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setMessage("");
    setUploading(true);
    try {
    const form = new FormData(formEl);
    await adminUpload("media/upload", token, form);
    formEl.reset();
    await load();
    setMessage("Uploaded.");
    toast({ tone: "success", title: "Media uploaded", description: "The asset is ready to reuse." });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
      toast({ tone: "error", title: "Upload failed", description: error instanceof Error ? error.message : "Please try another file." });
    } finally {
      setUploading(false);
    }
  }

  async function copyAsset(path: unknown) {
    const value = String(path ?? "");
    try {
      await navigator.clipboard.writeText(value);
      toast({ tone: "success", title: "Asset path copied", description: value });
    } catch {
      toast({ tone: "error", title: "Copy failed", description: "Clipboard permission was denied by the browser." });
    }
  }

  async function deleteMedia(id: unknown) {
    try {
      await adminFetch(`media/${id}`, token, { method: "DELETE" });
      await load();
      toast({ tone: "success", title: "Media deleted" });
    } catch (error) {
      toast({ tone: "error", title: "Failed to delete media", description: error instanceof Error ? error.message : "Please try again." });
    }
  }

  return (
    <Panel title="Media Manager" description="Upload validated images and PDF files for reusable portfolio assets.">
      <form className={`${softPanelClass} mb-5 grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center`} onSubmit={upload}>
        <label className="flex min-h-20 cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 transition hover:border-teal-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-teal-700">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-teal-700 shadow-sm dark:bg-slate-950 dark:text-teal-300">
            <ImageUp size={19} />
          </span>
          <span className="min-w-0">
            <span className="block font-semibold">Choose image or PDF</span>
            <span className="block text-sm text-slate-500">The uploaded asset will be available for previews and rich content.</span>
          </span>
          <input className="sr-only" name="file" required type="file" accept="image/*,.pdf" />
        </label>
        <button className={primaryButtonClass} disabled={uploading} type="submit">
          <ImageUp size={16} /> {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {message ? <p className="mb-4 text-sm text-slate-500">{message}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article className={`${softPanelClass} overflow-hidden transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal-950/5`} key={String(item.id)}>
            <MediaPreview path={item.file_path} />
            <div className="p-4">
            <p className="truncate font-semibold">{String(item.original_name ?? item.file_name ?? `#${item.id}`)}</p>
            <p className="mt-1 break-all text-xs text-slate-500">{String(item.file_path ?? "")}</p>
            <div className="mt-4 flex items-center justify-between gap-2 text-sm text-slate-500">
              <span>{String(item.mime_type ?? "image/jpeg")}</span>
              <div className="flex gap-1">
              <a className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900" href={publicAssetUrl(item.file_path)} target="_blank" rel="noreferrer" aria-label="Open asset">
                <ExternalLink size={16} />
              </a>
              <button className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900" type="button" aria-label="Copy asset path" onClick={() => copyAsset(item.file_path)}>
                <Copy size={16} />
              </button>
              <button className="rounded-xl p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950" type="button" aria-label="Delete asset" onClick={() => deleteMedia(item.id)}>
                <Trash2 size={16} />
              </button>
              </div>
            </div>
            </div>
          </article>
        ))}
        {items.length === 0 ? <EmptyState title="No media uploaded" description="Upload image and PDF assets here, then reuse them across admin content." /> : null}
      </div>
    </Panel>
  );
}

function Panel({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section>
      <div className="mb-6 overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-black/20">
        <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
              <span className="size-1.5 rounded-full bg-teal-500" />
              Admin Workspace
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 text-center text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <span className="rounded-xl bg-white px-3 py-2 shadow-sm dark:bg-slate-950">Edit</span>
            <span className="rounded-xl bg-white px-3 py-2 shadow-sm dark:bg-slate-950">Publish</span>
            <span className="rounded-xl bg-white px-3 py-2 shadow-sm dark:bg-slate-950">Sync</span>
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}
