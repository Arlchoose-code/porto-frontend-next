import type { MetadataRoute } from "next";
import { absoluteMediaUrl, getProfile } from "@/lib/api";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const profile = await getProfile();
  const icon = absoluteMediaUrl(profile.logo_url ?? profile.favicon_url);

  return {
    name: profile.site_name || "Syahril Haryono",
    short_name: profile.site_name || "Syahril",
    description: profile.site_description || "Full Stack Developer focused on AI-powered web products.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#06b6d4",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
      ...(icon
        ? [
            {
              src: icon,
              sizes: "512x512",
              type: icon.endsWith(".svg") ? "image/svg+xml" : "image/png",
            },
          ]
        : []),
    ],
  };
}
