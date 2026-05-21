import type { MetadataRoute } from "next";
import { absoluteSiteUrl, getBlogs, getProjects } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, projects] = await Promise.all([
    getBlogs({ limit: 200 }),
    getProjects({ limit: 200 }),
  ]);

  const staticRoutes = ["/", "/about", "/projects", "/blog", "/code-explainer", "/search", "/contact"].map((path) => ({
    url: absoluteSiteUrl(path),
    lastModified: new Date(),
  }));

  const blogRoutes = (blogs.data ?? []).map((blog) => ({
    url: absoluteSiteUrl(`/blog/${blog.slug}`),
    lastModified: new Date(blog.updated_at ?? blog.published_at ?? blog.created_at),
  }));

  const projectRoutes = (projects.data ?? []).map((project) => ({
    url: absoluteSiteUrl(`/projects/${project.slug}`),
    lastModified: new Date(project.updated_at ?? project.created_at),
  }));

  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}
