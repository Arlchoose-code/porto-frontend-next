import type { Metadata } from "next";
import { SEOSettingsPage } from "@/components/admin/admin-client";

export const metadata: Metadata = {
  title: "Admin SEO",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SEOSettingsPage />;
}
