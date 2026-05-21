import { ImageResponse } from "next/og";
import { getBlog, getProfile } from "@/lib/api";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [blog, profile] = await Promise.all([getBlog(slug), getProfile()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg,#020617,#083344,#111827)",
          color: "white",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#67e8f9", fontWeight: 700 }}>Blog</div>
        <div style={{ fontSize: 64, lineHeight: 1.08, fontWeight: 800, maxWidth: 980 }}>{blog.title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28, color: "#cbd5e1" }}>
          <span>{blog.author_display_name || profile.site_name}</span>
          <span>{profile.site_name}</span>
        </div>
      </div>
    ),
    size,
  );
}
