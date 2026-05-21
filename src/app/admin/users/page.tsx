import type { Metadata } from "next";
import { UsersPage } from "@/components/admin/admin-client";

export const metadata: Metadata = {
  title: "Admin Users",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <UsersPage />;
}
