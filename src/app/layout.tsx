import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LazyChat } from "@/components/lazy-chat";
import { Providers } from "@/components/providers";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { absoluteMediaUrl, getProfile } from "@/lib/api";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const siteName = profile.site_name || "Syahril Haryono";
  const description = profile.site_description || "Full Stack Developer focused on AI-powered web products.";
  const imageUrl = absoluteMediaUrl(profile.og_image_url ?? profile.avatar_url ?? profile.logo_url);
  const iconUrl = absoluteMediaUrl(profile.favicon_url ?? profile.logo_url);

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: profile.site_keywords ?? undefined,
    openGraph: {
      title: siteName,
      description,
      siteName,
      images: imageUrl ? [imageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    icons: {
      icon: iconUrl
        ? [
            { url: iconUrl },
            { url: "/icon", type: "image/png", sizes: "32x32" },
          ]
        : [{ url: "/icon", type: "image/png", sizes: "32x32" }],
      apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
      shortcut: iconUrl ? [iconUrl] : ["/icon"],
    },
    manifest: "/manifest.webmanifest",
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
      { media: "(prefers-color-scheme: dark)", color: "#020617" },
    ],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile().catch(() => undefined);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const profileJsonLd = profile
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile.site_name || "Syahril Haryono",
        url: siteUrl,
        image: absoluteMediaUrl(profile.avatar_url ?? profile.logo_url ?? profile.og_image_url),
        email: profile.email,
        jobTitle: profile.tagline,
        sameAs: [profile.github_url, profile.linkedin_url, profile.huggingface_url].filter(Boolean),
      }
    : null;
  const websiteJsonLd = profile
    ? {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: profile.site_name || "Syahril Haryono",
        url: siteUrl,
        description: profile.site_description,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }
    : null;

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50">
        {profileJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }} /> : null}
        {websiteJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} /> : null}
        <Providers>
          <div className="flex min-h-screen flex-col">
            <SiteHeader profile={profile} />
            <main className="flex-1">{children}</main>
            <SiteFooter profile={profile} />
          </div>
          <ScrollProgress />
          <LazyChat />
        </Providers>
      </body>
    </html>
  );
}
