import type { MetadataRoute } from "next";

/** Manifeste PWA AirAssist (servi sur /manifest.webmanifest). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AirAssist",
    short_name: "AirAssist",
    description: "Indemnisation de vol (règlement européen EC 261/2004).",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0060FF",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
