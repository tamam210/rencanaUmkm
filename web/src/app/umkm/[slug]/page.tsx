import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import TombolBagikan from "@/components/tombol-bagikan";
import { detailUmkm, LABEL_HARGA, type UmkmDetail } from "@/lib/api";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const u = await detailUmkm(slug);
    const deskripsi =
      u.deskripsi || `Profil ${u.nama}${u.kota ? ` di ${u.kota}` : ""}.`;
    return {
      title: `${u.nama} — RencanaUMKM`,
      description: deskripsi,
      openGraph: {
        title: u.nama,
        description: deskripsi,
        type: "website",
      },
    };
  } catch {
    return { title: "UMKM tidak ditemukan — RencanaUMKM" };
  }
}

function Baris({ label, nilai }: { label: string; nilai: string }) {
  return (
    <div className="flex gap-4 border-b border-gray-100 py-2.5 text-sm last:border-0">
      <dt className="w-32 shrink-0 text-gray-500">{label}</dt>
      <dd className="text-gray-800">{nilai}</dd>
    </div>
  );
}

async function Profil({ slug }: { slug: string }) {
  const u: UmkmDetail | null = await detailUmkm(slug).catch(() => null);
  if (!u) notFound();

  const lokasi = [u.kelurahan, u.kecamatan, u.kota, u.provinsi]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{u.nama}</h1>
          {u.range_harga && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
              {LABEL_HARGA[u.range_harga] ?? u.range_harga}
            </span>
          )}
        </div>

        {u.kategori && (
          <Link
            href={`/umkm?kategori=${u.kategori.slug}`}
            className="mt-2 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            {u.kategori.nama}
          </Link>
        )}

        {u.deskripsi && (
          <p className="mt-4 whitespace-pre-line text-gray-700">{u.deskripsi}</p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <TombolBagikan judul={u.nama} />
          {u.links.map((l) => (
            <a
              key={l.id}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {l.label || l.tipe_label}
            </a>
          ))}
        </div>
      </div>

      <dl className="rounded-2xl border border-gray-200 bg-white p-6">
        {lokasi && <Baris label="Lokasi" nilai={lokasi} />}
        {u.alamat && <Baris label="Alamat" nilai={u.alamat} />}
        {u.tahun_mulai && (
          <Baris label="Berdiri sejak" nilai={String(u.tahun_mulai)} />
        )}
        {u.jumlah_karyawan != null && (
          <Baris label="Karyawan" nilai={`${u.jumlah_karyawan} orang`} />
        )}
      </dl>
    </article>
  );
}

async function Isi({ params }: { params: Params }) {
  const { slug } = await params;
  return <Profil slug={slug} />;
}

export default function HalamanDetailUmkm({ params }: { params: Params }) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <Link
        href="/umkm"
        className="mb-6 inline-block text-sm text-emerald-700 hover:underline"
      >
        ← Kembali ke daftar
      </Link>
      <Suspense fallback={<p className="text-sm text-gray-400">Memuat profil…</p>}>
        <Isi params={params} />
      </Suspense>
    </main>
  );
}
