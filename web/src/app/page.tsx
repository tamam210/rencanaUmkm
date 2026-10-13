import Link from "next/link";
import { Suspense } from "react";

import { apiFetch } from "@/lib/api";

type Health = {
  status: string;
  service: string;
  database: string;
};

async function StatusSistem() {
  let health: Health | null = null;
  try {
    health = await apiFetch<Health>("/api/health/");
  } catch {
    health = null;
  }
  const sehat = health?.status === "ok" && health?.database === "ok";

  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          sehat ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      <span className="text-gray-500">
        {sehat ? "Semua sistem berjalan normal" : "Sebagian sistem belum siap"}
      </span>
    </div>
  );
}

const FITUR = [
  {
    judul: "Direktori UMKM",
    isi: "Jelajahi usaha berdasarkan kategori, lokasi, dan kisaran harga.",
    ikon: "🔎",
  },
  {
    judul: "Rekomendasi pintar",
    isi: "Isi preferensimu, dapat saran UMKM yang paling cocok beserta alasannya.",
    ikon: "✨",
    segera: true,
  },
  {
    judul: "Link mudah dibagikan",
    isi: "Tiap UMKM punya halaman sendiri yang rapi saat dibagikan.",
    ikon: "🔗",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Direktori &amp; rekomendasi UMKM
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Temukan UMKM yang tepat,
            <br />
            atau daftarkan usahamu.
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            RencanaUMKM membantu kamu menemukan usaha lokal yang cocok — dan
            membantu pelaku usaha ditemukan lebih banyak orang.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/umkm"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Jelajahi UMKM
            </Link>
            <span className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-500">
              Daftarkan usaha (segera)
            </span>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {FITUR.map((f) => (
            <div
              key={f.judul}
              className="rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div className="text-2xl">{f.ikon}</div>
              <h2 className="mt-3 flex items-center gap-2 font-semibold">
                {f.judul}
                {f.segera && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                    segera
                  </span>
                )}
              </h2>
              <p className="mt-1.5 text-sm text-gray-600">{f.isi}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Suspense
            fallback={<div className="h-4 w-56 animate-pulse rounded bg-gray-100" />}
          >
            <StatusSistem />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
