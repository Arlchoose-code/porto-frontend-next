export type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
  total_pages?: number;
  next_cursor?: string;
  has_more?: boolean;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  meta?: ApiMeta;
};

export type Profile = {
  id: number;
  tagline: string;
  bio: string;
  avatar_url: string | null;
  currently_learning: string | null;
  working_on: string | null;
  open_to_work: boolean;
  work_type: "remote" | "onsite" | "hybrid" | "any" | string;
  available_from: string | null;
  email: string;
  github_url: string | null;
  linkedin_url: string | null;
  huggingface_url: string | null;
  resume_url: string | null;
  site_name: string;
  site_description: string | null;
  site_keywords: string | null;
  og_image_url: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  updated_at: string;
};

export type LinkItem = {
  label: string;
  url: string;
};

export type Project = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  thumbnail_url: string | null;
  github_url: string | null;
  huggingface_url: string | null;
  live_url: string | null;
  other_links: LinkItem[] | null;
  tech_stack: string[] | null;
  status: string;
  featured: boolean;
  order: number;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Blog = {
  id: number;
  title: string;
  slug: string;
  content?: string;
  summary: string;
  thumbnail_url: string | null;
  author_type: "user" | "ai" | string;
  author_display_name: string;
  generation_sources?: LinkItem[] | null;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image_url: string | null;
  tags: string[] | null;
  reading_time: number;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Experience = {
  id: number;
  company: string;
  position: string;
  location: string | null;
  work_type: string;
  location_type: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  company_url: string | null;
  order: number;
};

export type Education = {
  id: number;
  institution: string;
  degree: string | null;
  field: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  institution_url: string | null;
  order: number;
};

export type Skill = {
  id: number;
  name: string;
  category: string;
  icon_key: string | null;
  level: "beginner" | "intermediate" | "advanced" | "expert" | string;
  order: number;
};

export type Certificate = {
  id: number;
  title: string;
  issuer: string;
  issuer_logo_url: string | null;
  credential_id: string | null;
  credential_url: string | null;
  issued_at: string;
  category: string | null;
  order: number;
};

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type SearchResult = {
  id: number;
  type: "project" | "blog" | string;
  title: string;
  slug: string;
  summary?: string | null;
  url?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type SEOPageConfig = {
  id?: number;
  key: string;
  path: string;
  title: string;
  description: string;
  canonical_path: string;
  og_image_url: string | null;
  keywords: string[];
  robots_index: boolean;
  robots_follow: boolean;
  schema_type: string;
  breadcrumb_label: string;
  updated_at?: string;
};

export type SEOSettings = {
  global: {
    site_name: string;
    site_description: string;
    site_keywords: string[];
    og_image_url: string | null;
    logo_url: string | null;
    favicon_url: string | null;
    updated_at: string;
  };
  pages: Record<string, SEOPageConfig>;
};
