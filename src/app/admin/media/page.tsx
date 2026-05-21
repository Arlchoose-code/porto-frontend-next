import type { Metadata } from "next";
import { MediaPage } from "@/components/admin/admin-client";

export const metadata: Metadata = {
  title: "Admin Media",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MediaPage />;
}
