import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Image Open Graph générée (aperçu social / réseaux). Générique à toutes les pages.
export default function Image() {
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
          background: "linear-gradient(135deg, #0d2a5e 0%, #1f6feb 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 40, opacity: 0.9 }}>✈ Air Assist</div>
        <div style={{ fontSize: 70, fontWeight: 800, marginTop: 24, lineHeight: 1.1 }}>
          Vos indemnités de vol
        </div>
        <div style={{ fontSize: 44, marginTop: 16, opacity: 0.95 }}>
          Retard, annulation, surbooking — EC 261/2004
        </div>
        <div style={{ fontSize: 32, marginTop: 32, opacity: 0.85 }}>
          Jusqu'à 600 € · Sans gain, sans frais
        </div>
      </div>
    ),
    { ...size },
  );
}
