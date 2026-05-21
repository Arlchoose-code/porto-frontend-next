import type { Metadata } from "next";
import { ContactsPage } from "@/components/admin/admin-client";

export const metadata: Metadata = {
  title: "Admin Inbox",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ContactsPage />;
}
