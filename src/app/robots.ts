import type { MetadataRoute } from "next";
import { absoluteSiteUrl } from "@/lib/api";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/admin"],
    },
    sitemap: absoluteSiteUrl("/sitemap.xml"),
  };
}
