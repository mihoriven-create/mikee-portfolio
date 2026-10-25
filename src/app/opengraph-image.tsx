import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "radial-gradient(circle at 80% 20%, rgba(212,175,55,0.35), #0a0a0a 55%)",
          color: "#f4efe6",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 10, textTransform: "uppercase", color: "#d4af37" }}>{site.title}</div>
        <div style={{ fontSize: 92, fontWeight: 900, lineHeight: 1, marginTop: 24, textTransform: "uppercase" }}>Michael John</div>
        <div
          style={{
            fontSize: 132,
            fontWeight: 900,
            lineHeight: 1,
            textTransform: "uppercase",
            backgroundImage: "linear-gradient(180deg, #f7e3a1, #d4af37 50%, #8c6a22)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Buencamino
        </div>
        <div style={{ fontSize: 28, marginTop: 36, color: "#cfc6b5" }}>{site.tagline}</div>
      </div>
    ),
    size,
  );
}
