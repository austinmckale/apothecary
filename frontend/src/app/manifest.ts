import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Libby's Aroid Apothecary",
    short_name: "Libby's Apothecary",
    description: "Concierge rare aroid studio in Reading, PA",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7f1",
    theme_color: "#0f172a",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/favicon.png", sizes: "64x64", type: "image/png" },
    ],
    shortcuts: [
      {
        name: "Open Admin",
        short_name: "Admin",
        url: "/admin",
      },
      {
        name: "Timelapse Feed",
        short_name: "Timelapse",
        url: "/timelapse",
      },
    ],
  };
}

