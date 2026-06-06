import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#e63946",
};

export const metadata: Metadata = {
  title: "World Cup 2026 - Sticker Album Tracker",
  description: "La página que te ayuda a organizar tus láminas de Panini del Mundial 2026. Controla qué tienes y qué te falta.",
  keywords: ["panini", "mundial 2026", "álbum", "láminas", "stickers", "fifa", "felipec.ia", "creamostuweb.co"],
  authors: [{ name: "felipec.ia", url: "https://instagram.com/felipec.ia" }],
  creator: "felipec.ia",
  publisher: "creamostuweb.co",
  manifest: "/manifest.json",
  openGraph: {
    title: "World Cup 2026 - Sticker Album Tracker",
    description: "La página que te ayuda a organizar tus láminas de Panini del Mundial 2026. Hecho por @felipec.ia 🌟",
    siteName: "World Cup 2026 - Sticker Album Tracker",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "World Cup 2026 - Sticker Album Tracker",
    description: "La página que te ayuda a organizar tus láminas de Panini del Mundial 2026. Hecho por @felipec.ia 🌟",
    creator: "@felipec.ia",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "World Cup 2026 - Sticker Album Tracker",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <ServiceWorkerRegistration />
        {children}

        <script defer src="https://cloud.umami.is/script.js" data-website-id="af355812-8e1d-46f5-8134-f2781e0a920b"></script>
      </body>
    </html>
  );
}