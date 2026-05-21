import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPublicPreview } from "@/components/admin/admin-public-preview";

export const metadata: Metadata = {
  title: "Draft Preview",
  robots: { index: false, follow: false },
};

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource, id } = await params;

  if (resource !== "blogs" && resource !== "projects") notFound();

  return <AdminPublicPreview id={id} resource={resource} />;
}
