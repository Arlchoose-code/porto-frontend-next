import type { Metadata } from "next";
import { RevalidatePage } from "@/components/admin/admin-client";

export const metadata: Metadata = {
  title: "Admin Revalidate",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <RevalidatePage />;
}
