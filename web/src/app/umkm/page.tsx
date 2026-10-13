import Link from "next/link";
import { Suspense } from "react";

import { daftarKategori, daftarUmkm, LABEL_HARGA, type FilterUmkm } from "@/lib/api";

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

function KartuUmkm({
  slug,
  nama,
  kategori,
  deskripsi,
  kota,
  provinsi,
  rangeHarga,
}: {
  slug: string;
  nama: string;
  kategori: string | null;
  deskripsi: string;
  kota: string;
  provinsi: string;
  rangeHarga: string;
}) {
  return (
    <Link
      href={`/umkm/${slug}`}
      className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold text-gray-900 group-hover:text-emerald-700">
          {nama}
        </h2>
        {rangeHarga && (
          <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
            {LABEL_HARGA[rangeHarga] ?? rangeHarga}
          </span>
        )}
      </div>

      {kategori && (
        <span className="mt-1.5 inline-block w-fit rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          {kategori}
        </span>
      )}

      <p className="mt-3 line-clamp-2 flex-1 text-sm text-gray-600">{deskripsi}</p>

      <p className="mt-4 text-xs text-gray-400">
        {[kota, provinsi].filter(Boolean).join(", ") || "Lokasi belum diisi"}
      </p>
    </Link>
  );
}

async function Konten({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const filter: FilterUmkm = {
    q: pertama(sp.q),
    kategori: pertama(sp.kategori),
    kota: pertama(sp.kota),
    harga: pertama(sp.harga),
  };
  const adaFilter = Boolean(filter.q || filter.kategori || filter.kota || filter.harga);

  const [kategoriList, data] = await Promise.all([
    daftarKategori(),
    daftarUmkm(filter),
  ]);

  return (
    <div className="space-y-6">
      <form
        method="get"
        className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-[1fr_auto_auto_auto]"
      >
        <input
          type="text"
          name="q"
          defaultValue={filter.q}
          placeholder="Cari nama atau kata kunci…"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
        />
        <select
          name="kategori"
          defaultValue={filter.kategori}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
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
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
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
          className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Cari
        </button>
      </form>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-800">{data.count}</span> UMKM
          ditemukan
        </p>
        {adaFilter && (
          <Link
            href="/umkm"
            className="text-sm text-emerald-700 hover:underline"
          >
            Reset filter
          </Link>
        )}
      </div>

      {data.count === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
          Gak ada UMKM yang cocok. Coba ubah kata kunci atau filternya.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.results.map((u) => (
            <KartuUmkm
              key={u.id}
              slug={u.slug}
              nama={u.nama}
              kategori={u.kategori?.nama ?? null}
              deskripsi={u.deskripsi}
              kota={u.kota}
              provinsi={u.provinsi}
              rangeHarga={u.range_harga}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-16 animate-pulse rounded-2xl bg-gray-100" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-100" />
        ))}
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
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Daftar UMKM</h1>
        <p className="mt-1 text-sm text-gray-500">
          Temukan usaha lokal berdasarkan kategori, lokasi, dan harga.
        </p>
      </header>
      <Suspense fallback={<Skeleton />}>
        <Konten searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
