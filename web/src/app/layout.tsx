import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "RencanaUMKM — Direktori & Rekomendasi UMKM",
  description:
    "Temukan UMKM yang cocok buatmu, atau daftarkan usahamu. Dilengkapi rekomendasi pintar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-gray-200">
          <nav className="mx-auto flex w-full max-w-4xl items-center gap-6 p-4 text-sm">
            <Link href="/" className="font-bold">
              RencanaUMKM
            </Link>
            <Link href="/umkm" className="text-gray-600 hover:text-black">
              Daftar UMKM
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
