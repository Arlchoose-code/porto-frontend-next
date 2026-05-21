import type { Metadata } from "next";
import { GeneratePage } from "@/components/admin/admin-client";

export const metadata: Metadata = {
  title: "AI Blog Generate",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <GeneratePage />;
}
