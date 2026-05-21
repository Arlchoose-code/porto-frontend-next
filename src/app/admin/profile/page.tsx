import type { Metadata } from "next";
import { ProfilePage } from "@/components/admin/admin-client";

export const metadata: Metadata = {
  title: "Admin Profile",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ProfilePage />;
}
