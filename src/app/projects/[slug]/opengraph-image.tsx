import { ImageResponse } from "next/og";
import { getProfile, getProject } from "@/lib/api";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, profile] = await Promise.all([getProject(slug), getProfile()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg,#020617,#164e63,#111827)",
          color: "white",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#67e8f9", fontWeight: 700 }}>Project</div>
        <div style={{ fontSize: 68, lineHeight: 1.05, fontWeight: 800, maxWidth: 980 }}>{project.title}</div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 26, color: "#cbd5e1" }}>
          {(project.tech_stack ?? []).slice(0, 5).map((tech) => (
            <span key={tech} style={{ padding: "10px 18px", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 999 }}>{tech}</span>
          ))}
          <span>{profile.site_name}</span>
        </div>
      </div>
    ),
    size,
  );
}
