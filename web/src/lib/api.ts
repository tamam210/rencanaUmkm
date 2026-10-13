export const API_URL = process.env.API_URL ?? "http://127.0.0.1:8000";

/**
 * Panggil API backend (Django).
 * Dipakai di Server Component — jadi URL backend tidak bocor ke browser.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API ${path} gagal (HTTP ${res.status})`);
  }
  return (await res.json()) as T;
}

// --- Tipe data ---

export type Kategori = {
  id: number;
  nama: string;
  slug: string;
};

export type UmkmLink = {
  id: number;
  tipe: string;
  tipe_label: string;
  url: string;
  label: string;
  jumlah_klik: number;
};

export type Umkm = {
  id: number;
  nama: string;
  slug: string;
  kategori: Kategori | null;
  deskripsi: string;
  kota: string;
  provinsi: string;
  range_harga: string;
};

export type UmkmDetail = Umkm & {
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  tahun_mulai: number | null;
  jumlah_karyawan: number | null;
  links: UmkmLink[];
  dibuat: string;
  diperbarui: string;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type FilterUmkm = {
  q?: string;
  kategori?: string;
  kota?: string;
  harga?: string;
};

// --- Fungsi API ---

export function daftarUmkm(filter: FilterUmkm = {}): Promise<Paginated<Umkm>> {
  const sp = new URLSearchParams();
  if (filter.q) sp.set("q", filter.q);
  if (filter.kategori) sp.set("kategori", filter.kategori);
  if (filter.kota) sp.set("kota", filter.kota);
  if (filter.harga) sp.set("harga", filter.harga);
  const qs = sp.toString();
  return apiFetch<Paginated<Umkm>>(`/api/umkm/${qs ? `?${qs}` : ""}`);
}

export function detailUmkm(slug: string): Promise<UmkmDetail> {
  return apiFetch<UmkmDetail>(`/api/umkm/${encodeURIComponent(slug)}/`);
}

export function daftarKategori(): Promise<Paginated<Kategori>> {
  return apiFetch<Paginated<Kategori>>("/api/kategori/");
}

export const LABEL_HARGA: Record<string, string> = {
  murah: "Murah",
  sedang: "Sedang",
  mahal: "Mahal",
};
