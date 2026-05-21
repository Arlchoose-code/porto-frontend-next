import type { Metadata } from "next";
import { DashboardPage } from "@/components/admin/admin-client";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DashboardPage />;
}
