import type { Metadata } from "next";
import { absoluteMediaUrl, absoluteSiteUrl } from "./api";
import type { Profile, SEOPageConfig, SEOSettings } from "./types";

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  keywords?: string[];
  type?: "website" | "article";
  noindex?: boolean;
};

export function pageSeo({
  title,
  description,
  path,
  image,
  keywords,
  noindex,
  type = "website",
}: PageSeoInput): Metadata {
  const canonical = absoluteSiteUrl(path);
  const imageUrl = absoluteMediaUrl(image) ?? absoluteSiteUrl("/opengraph-image");

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      type,
      url: canonical,
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function profileSeoImage(profile: Profile) {
  return profile.og_image_url ?? profile.avatar_url ?? profile.logo_url ?? profile.favicon_url;
}

export function metadataFromSEOPage(settings: SEOSettings | null, key: string, fallback: PageSeoInput): Metadata {
  const page = settings?.pages?.[key];
  if (!page) return pageSeo(fallback);

  return pageSeo({
    title: page.title || fallback.title,
    description: page.description || fallback.description,
    path: page.canonical_path || page.path || fallback.path,
    image: page.og_image_url ?? settings?.global.og_image_url ?? settings?.global.logo_url ?? fallback.image,
    keywords: page.keywords?.length ? page.keywords : fallback.keywords,
    noindex: !page.robots_index,
    type: fallback.type,
  });
}

export function webPageJsonLd(page: SEOPageConfig, settings: SEOSettings | null) {
  return {
    "@context": "https://schema.org",
    "@type": page.schema_type || "WebPage",
    name: page.title,
    description: page.description,
    url: absoluteSiteUrl(page.canonical_path || page.path),
    isPartOf: settings?.global.site_name
      ? {
          "@type": "WebSite",
          name: settings.global.site_name,
          url: absoluteSiteUrl("/"),
        }
      : undefined,
  };
}

export function collectionJsonLd({
  description,
  items,
  name,
  path,
}: {
  description: string;
  items: Array<{ name: string; url: string }>;
  name: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteSiteUrl(path),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteSiteUrl(item.url),
      })),
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteSiteUrl(item.path),
    })),
  };
}
