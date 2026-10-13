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
      <body className="flex min-h-full flex-col bg-gray-50 text-gray-900">
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
          <nav className="mx-auto flex w-full max-w-5xl items-center gap-6 px-6 py-3.5 text-sm">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-gray-900"
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
              RencanaUMKM
            </Link>
            <Link
              href="/umkm"
              className="text-gray-600 transition hover:text-emerald-700"
            >
              Daftar UMKM
            </Link>
            <span className="ml-auto rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Rekomendasi AI segera
            </span>
          </nav>
        </header>

        {children}

        <footer className="border-t border-gray-200 bg-white">
          <div className="mx-auto w-full max-w-5xl px-6 py-6 text-xs text-gray-400">
            RencanaUMKM — direktori &amp; rekomendasi UMKM. Dibangun bertahap;
            fitur rekomendasi AI menyusul.
          </div>
        </footer>
      </body>
    </html>
  );
}
