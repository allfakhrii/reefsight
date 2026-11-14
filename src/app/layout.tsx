import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "REEFSIGHT — Platform Kecerdasan Ekologis Terumbu Karang Pulau Tunda",
  description: "Platform Kecerdasan Ekologis untuk Analisis Dinamika dan Tekanan Lingkungan Terumbu Karang di Pulau Tunda, Kabupaten Serang, Banten. Mengintegrasikan IoT EchoVision, WebGIS MapLibre, Bioakustik, dan Pemodelan Karang.",
  icons: {
    icon: [
      { url: '/brand/logo.jpg', type: 'image/jpeg' },
      { url: '/brand/logo-badge.jpg', type: 'image/jpeg' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/brand/logo.jpg', sizes: '180x180', type: 'image/jpeg' },
    ],
    shortcut: '/brand/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/brand/logo.jpg" type="image/jpeg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/brand/logo.jpg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F8FAFC] text-slate-800 min-h-screen selection:bg-orange-500 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
