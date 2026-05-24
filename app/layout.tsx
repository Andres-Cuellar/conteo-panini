import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Panini World Cup 2026 - Sticker Album Tracker",
  description: "Track your FIFA World Cup 2026 Panini sticker collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}