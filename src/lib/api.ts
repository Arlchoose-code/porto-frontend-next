import { notFound } from "next/navigation";
import type {
  ApiResponse,
  Blog,
  Certificate,
  ChatMessage,
  ContactPayload,
  Education,
  Experience,
  Profile,
  Project,
  SearchResult,
  SEOSettings,
  Skill,
} from "./types";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

const fallbackProfile: Profile = {
  id: 1,
  tagline: "Full Stack Developer with an AI focus.",
  bio: "Syahril Haryono builds full-stack web applications and AI-focused developer tools.",
  avatar_url: null,
  currently_learning: "AI engineering, Go, and scalable web architecture",
  working_on: "AI-powered portfolio systems",
  open_to_work: true,
  work_type: "remote",
  available_from: null,
  email: "syahrilharyono@example.com",
  github_url: "https://github.com/Arlchoose-code",
  linkedin_url: "https://www.linkedin.com/in/syahril-haryono/",
  huggingface_url: "https://huggingface.co/syhrlhyn",
  resume_url: null,
  site_name: "Syahril Haryono",
  site_description: "Full Stack Developer focused on AI-powered web products.",
  site_keywords: "full stack developer, AI, Go, Next.js",
  og_image_url: null,
  logo_url: null,
  favicon_url: null,
  updated_at: new Date(0).toISOString(),
};

type QueryValue = string | number | boolean | undefined | null;

function toQuery(params?: Record<string, QueryValue>) {
  const search = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });

  const query = search.toString();
  return query ? `?${query}` : "";
}

export function mediaUrl(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const uploadIndex = normalized.indexOf("/uploads/");
  if (uploadIndex >= 0) {
    return normalized.slice(uploadIndex);
  }
  return normalized;
}

export function absoluteSiteUrl(path = "/") {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return new URL(path, baseUrl).toString();
}

export function absoluteMediaUrl(path?: string | null) {
  const url = mediaUrl(path);
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return absoluteSiteUrl(url);
}

async function request<T>(
  path: string,
  init?: RequestInit & { next?: NextFetchRequestConfig; timeoutMs?: number },
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), init?.timeoutMs ?? 3500);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: init?.signal ?? controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } finally {
    clearTimeout(timeout);
  }

  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !body?.success) {
    throw new Error(body?.message ?? `Request failed: ${response.status}`);
  }

  return body;
}

export async function getProfile() {
  try {
    const res = await request<Profile>("/api/v1/profile", {
      next: { revalidate: 300, tags: ["profile"] },
    });
    return res.data ?? fallbackProfile;
  } catch {
    return fallbackProfile;
  }
}

export async function getExperiences() {
  try {
    const res = await request<Experience[]>("/api/v1/experiences", {
      next: { revalidate: 300, tags: ["experiences"] },
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getEducations() {
  try {
    const res = await request<Education[]>("/api/v1/educations", {
      next: { revalidate: 300, tags: ["educations"] },
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getSkills() {
  try {
    const res = await request<Skill[]>("/api/v1/skills", {
      next: { revalidate: 300, tags: ["skills"] },
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getProjects(params?: {
  page?: number;
  limit?: number;
  search?: string;
  tech?: string;
  featured?: boolean;
}) {
  try {
    return request<Project[]>(`/api/v1/projects${toQuery(params)}`, {
      next: { revalidate: 300, tags: ["projects"] },
    });
  } catch {
    return { success: true, data: [], meta: { page: 1, limit: params?.limit ?? 10, total: 0, total_pages: 0 } };
  }
}

export async function getProject(slug: string) {
  try {
    const res = await request<Project>(`/api/v1/projects/${slug}`, {
      next: { revalidate: 300, tags: ["projects", `project:${slug}`] },
    });
    if (!res.data) notFound();
    return res.data;
  } catch {
    notFound();
  }
}

export async function getBlogs(params?: {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
}) {
  try {
    return request<Blog[]>(`/api/v1/blogs${toQuery(params)}`, {
      next: { revalidate: 300, tags: ["blogs"] },
    });
  } catch {
    return { success: true, data: [], meta: { page: 1, limit: params?.limit ?? 10, total: 0, total_pages: 0 } };
  }
}

export async function getBlog(slug: string) {
  try {
    const res = await request<Blog>(`/api/v1/blogs/${slug}`, {
      next: { revalidate: 300, tags: ["blogs", `blog:${slug}`] },
    });
    if (!res.data) notFound();
    return res.data;
  } catch {
    notFound();
  }
}

export async function getCertificates(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) {
  try {
    return request<Certificate[]>(`/api/v1/certificates${toQuery(params)}`, {
      next: { revalidate: 300, tags: ["certificates"] },
    });
  } catch {
    return { success: true, data: [], meta: { page: 1, limit: params?.limit ?? 10, total: 0, total_pages: 0 } };
  }
}

export async function searchPortfolio(query: string) {
  if (!query.trim()) return { success: true, data: [] as SearchResult[] };
  try {
    return request<SearchResult[]>(`/api/v1/search${toQuery({ q: query })}`, {
      next: { revalidate: 120, tags: ["search"] },
    });
  } catch {
    return { success: true, data: [] as SearchResult[] };
  }
}

export async function getSEOSettings() {
  try {
    const res = await request<SEOSettings>("/api/v1/seo/settings", {
      next: { revalidate: 300, tags: ["profile", "seo"] },
    });
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function postContact(payload: ContactPayload) {
  return request<never>("/api/v1/contact", {
    method: "POST",
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

export async function postChat(messages: ChatMessage[]) {
  const res = await request<{ reply: string }>("/api/v1/ai/chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
    cache: "no-store",
    timeoutMs: 60000,
  });
  return res.data?.reply ?? "";
}
