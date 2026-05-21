import { ImageResponse } from "next/og";
import { absoluteMediaUrl, getProfile } from "@/lib/api";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const profile = await getProfile();
  const icon = absoluteMediaUrl(profile.favicon_url ?? profile.logo_url);

  if (icon) {
    return new ImageResponse(
      (
        <div
          style={{
            alignItems: "center",
            background: "#020617",
            display: "flex",
            height: "100%",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" height="32" src={icon} style={{ height: 32, objectFit: "cover", width: 32 }} width="32" />
        </div>
      ),
      size,
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg,#020617,#0891b2)",
          color: "white",
          display: "flex",
          fontFamily: "sans-serif",
          fontSize: 14,
          fontWeight: 800,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        SH
      </div>
    ),
    size,
  );
}
