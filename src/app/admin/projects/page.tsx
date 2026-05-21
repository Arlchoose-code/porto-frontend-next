import type { Metadata } from "next";
import { ResourcePage } from "@/components/admin/admin-client";

export const metadata: Metadata = {
  title: "Admin Projects",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ResourcePage resourceKey="projects" />;
}
