import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CircuScan | Circular Electronics & E-Waste Triage",
  description: "Mobile PWA for circular electronics triage, RapidOCR serial scanning, Gemini Flash multimodal reasoning, deterministic 4R utility scoring, and Indian e-waste drop-off mapping.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CircuScan",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0B1315",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050b0e] text-slate-100 min-h-screen antialiased flex flex-col selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
