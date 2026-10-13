import { Suspense } from "react";
import { apiFetch } from "@/lib/api";

type Health = {
  status: string;
  service: string;
  database: string;
  error?: string;
};

async function getHealth(): Promise<Health | null> {
  try {
    return await apiFetch<Health>("/api/health/");
  } catch {
    return null;
  }
}

/** Kartu status — data-nya diambil di server, jadi dibungkus <Suspense>. */
async function StatusCard() {
  const health = await getHealth();
  const apiOk = health?.status === "ok";
  const dbOk = health?.database === "ok";

  return (
    <section className="rounded-xl border border-gray-200 p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Status sistem
      </h2>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center justify-between">
          <span>Frontend (Next.js)</span>
          <span className="font-medium text-green-600">✓ hidup</span>
        </li>
        <li className="flex items-center justify-between">
          <span>Backend (Django)</span>
          <span className={apiOk ? "font-medium text-green-600" : "font-medium text-red-600"}>
            {apiOk ? "✓ nyambung" : "✗ tidak nyambung"}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span>Database (PostgreSQL)</span>
          <span className={dbOk ? "font-medium text-green-600" : "font-medium text-red-600"}>
            {dbOk ? "✓ nyambung" : "✗ tidak nyambung"}
          </span>
        </li>
      </ul>
      {!apiOk && (
        <p className="mt-4 text-xs text-red-600">
          Backend belum jalan. Jalankan API-nya dulu (lihat docs/sensory-id-cara-bikin.md).
        </p>
      )}
    </section>
  );
}

function StatusSkeleton() {
  return (
    <section className="rounded-xl border border-gray-200 p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Status sistem
      </h2>
      <p className="text-sm text-gray-400">Memeriksa…</p>
    </section>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 p-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">RencanaUMKM</h1>
        <p className="text-gray-600">
          Direktori &amp; rekomendasi UMKM. <br />
          <span className="text-sm">Tahap pembangunan: Fase 0 (fondasi).</span>
        </p>
      </header>

      <Suspense fallback={<StatusSkeleton />}>
        <StatusCard />
      </Suspense>
    </main>
  );
}
