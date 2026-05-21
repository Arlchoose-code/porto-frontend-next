import { ImageResponse } from "next/og";
import { absoluteMediaUrl, getProfile } from "@/lib/api";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const profile = await getProfile();
  const icon = absoluteMediaUrl(profile.logo_url ?? profile.favicon_url);

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg,#020617,#0e7490,#111827)",
          borderRadius: 40,
          color: "white",
          display: "flex",
          fontFamily: "sans-serif",
          fontSize: 54,
          fontWeight: 900,
          height: "100%",
          justifyContent: "center",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="" height="180" src={icon} style={{ height: 180, objectFit: "cover", width: 180 }} width="180" />
        ) : (
          "SH"
        )}
      </div>
    ),
    size,
  );
}
