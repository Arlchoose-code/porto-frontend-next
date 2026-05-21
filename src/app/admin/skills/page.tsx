import type { Metadata } from "next";
import { ResourcePage } from "@/components/admin/admin-client";

export const metadata: Metadata = {
  title: "Admin Skills",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ResourcePage resourceKey="skills" />;
}
