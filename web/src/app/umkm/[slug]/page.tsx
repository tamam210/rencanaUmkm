import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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
    <div className="flex gap-2 text-sm">
      <dt className="w-28 shrink-0 text-gray-500">{label}</dt>
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
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">{u.nama}</h1>
          {u.range_harga && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
              {LABEL_HARGA[u.range_harga] ?? u.range_harga}
            </span>
          )}
        </div>
        {u.kategori && (
          <Link
            href={`/umkm?kategori=${u.kategori.slug}`}
            className="mt-1 inline-block text-sm text-blue-600 hover:underline"
          >
            {u.kategori.nama}
          </Link>
        )}
      </div>

      <p className="whitespace-pre-line text-gray-700">{u.deskripsi}</p>

      <dl className="space-y-2 rounded-xl border border-gray-200 p-5">
        {lokasi && <Baris label="Lokasi" nilai={lokasi} />}
        {u.alamat && <Baris label="Alamat" nilai={u.alamat} />}
        {u.tahun_mulai && (
          <Baris label="Berdiri sejak" nilai={String(u.tahun_mulai)} />
        )}
        {u.jumlah_karyawan != null && (
          <Baris label="Karyawan" nilai={`${u.jumlah_karyawan} orang`} />
        )}
      </dl>

      {u.links.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Hubungi / belanja
          </h2>
          <div className="flex flex-wrap gap-2">
            {u.links.map((l) => (
              <a
                key={l.id}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                {l.label || l.tipe_label}
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

async function Isi({ params }: { params: Params }) {
  const { slug } = await params;
  return <Profil slug={slug} />;
}

export default function HalamanDetailUmkm({ params }: { params: Params }) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 p-8">
      <Link href="/umkm" className="mb-6 inline-block text-sm text-blue-600 hover:underline">
        ← Kembali ke daftar
      </Link>
      <Suspense fallback={<p className="text-sm text-gray-400">Memuat profil…</p>}>
        <Isi params={params} />
      </Suspense>
    </main>
  );
}
