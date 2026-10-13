import Link from "next/link";
import { Suspense } from "react";

import {
  daftarKategori,
  daftarUmkm,
  LABEL_HARGA,
  type FilterUmkm,
} from "@/lib/api";

export const metadata = {
  title: "Daftar UMKM — RencanaUMKM",
  description:
    "Jelajahi UMKM berdasarkan kategori, lokasi, dan kisaran harga. Temukan usaha yang cocok buatmu.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function pertama(nilai: string | string[] | undefined): string {
  if (Array.isArray(nilai)) return nilai[0] ?? "";
  return nilai ?? "";
}

async function Konten({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const filter: FilterUmkm = {
    q: pertama(sp.q),
    kategori: pertama(sp.kategori),
    kota: pertama(sp.kota),
    harga: pertama(sp.harga),
  };

  const [kategoriList, data] = await Promise.all([
    daftarKategori(),
    daftarUmkm(filter),
  ]);

  return (
    <div className="space-y-6">
      <form method="get" className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <input
          type="text"
          name="q"
          defaultValue={filter.q}
          placeholder="Cari nama atau kata kunci…"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          name="kategori"
          defaultValue={filter.kategori}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Semua kategori</option>
          {kategoriList.results.map((k) => (
            <option key={k.id} value={k.slug}>
              {k.nama}
            </option>
          ))}
        </select>
        <select
          name="harga"
          defaultValue={filter.harga}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Semua harga</option>
          {Object.entries(LABEL_HARGA).map(([nilai, label]) => (
            <option key={nilai} value={nilai}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Cari
        </button>
      </form>

      <p className="text-sm text-gray-500">{data.count} UMKM ditemukan</p>

      {data.count === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          Gak ada UMKM yang cocok. Coba ubah filternya.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.results.map((u) => (
            <Link
              key={u.id}
              href={`/umkm/${u.slug}`}
              className="rounded-xl border border-gray-200 p-4 transition hover:border-gray-400"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold">{u.nama}</h2>
                {u.range_harga && (
                  <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {LABEL_HARGA[u.range_harga] ?? u.range_harga}
                  </span>
                )}
              </div>
              {u.kategori && (
                <span className="mt-1 inline-block text-xs text-gray-500">
                  {u.kategori.nama}
                </span>
              )}
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                {u.deskripsi}
              </p>
              <p className="mt-3 text-xs text-gray-400">
                {[u.kota, u.provinsi].filter(Boolean).join(", ")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 animate-pulse rounded-lg bg-gray-100" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}

export default function HalamanDaftarUmkm({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 p-8">
      <h1 className="mb-6 text-2xl font-bold">Daftar UMKM</h1>
      <Suspense fallback={<Skeleton />}>
        <Konten searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
