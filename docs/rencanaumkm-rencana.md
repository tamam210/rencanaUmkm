# Rencana Proyek: RencanaUMKM

> Status: **Draft — masih didiskusikan**
> Prinsip: **Bangun dulu TANPA AI**, bagian AI ditambah belakangan (di server sendiri).

---

## 1. Ringkasan Ide

Membangun platform ala **SAPA UMKM**, tapi dengan tambahan **AI recommender** yang memberi saran
*"cocoknya masuk/dukung UMKM yang mana, dan kenapa"*.

Sifat platform: **marketplace dua sisi**
- **Penjual / pemilik UMKM** → daftarkan & kelola profil usahanya.
- **Pembeli / pencari** → isi preferensi, dapat rekomendasi UMKM.

Fokus tambahan:
- **Link publik** tiap UMKM yang bisa dishare.
- **Link hasil rekomendasi AI** yang shareable.
- **Link keluar** ke marketplace/sosmed UMKM (Shopee/IG/WA/Web).
- **Referral / afiliasi** dengan pencatatan klik.

---

## 2. Prinsip & Keputusan yang Sudah Disepakati

| Topik | Keputusan |
|---|---|
| Referensi | SAPA UMKM / Kementerian UMKM |
| Sisi pengguna | Dua sisi (pembeli + penjual) |
| Bentuk aplikasi | **Web + Mobile** (web responsive dulu, mobile menyusul) |
| Tujuan rekomendasi | **Campur** — user pilih sendiri saat isi preferensi (partner usaha / investasi / belanja) |
| Akses | **Boleh coba tanpa login.** Login cuma buat simpan riwayat & profil |
| Backend | **Django + Django REST Framework** (dipilih karena butuh Django Admin untuk verifikasi data) — **API-first**, biar web & mobile bisa pakai API yang sama |
| Frontend Web | **Next.js + TypeScript** (App Router, Tailwind, shadcn/ui) |
| Mobile | **React Native + Expo** (bahasa sama = TypeScript, bisa berbagi tipe & logic dengan web) |
| Database | PostgreSQL |
| Cache | Redis (dipakai nanti buat cache hasil AI) |
| AI | **Ditunda.** Nanti jalan di **server sendiri** (Ollama / endpoint OpenAI-compatible), dirancang provider-agnostic |
| Sumber data | Dataset terbuka **+** submission dari user (penjual daftar, pembeli isi preferensi). Langkah berikut: **cek detail dataset** dulu |

### Kenapa JS + Python bareng?
Dua app terpisah, komunikasi lewat REST. Normal, bukan hal aneh.
- **Next.js** → yang dilihat user + SEO + Open Graph (penting buat link yang shareable).
- **Django** → data, auth, verifikasi, logika bisnis, dan nanti AI.

---

## 3. Arsitektur

```
[ Next.js (web) ] ───┐
                     │
                     ├── <--REST/JSON--> [ Django + DRF ] --> PostgreSQL
                     │                        data, auth,        Redis
[ Mobile (Expo/RN) ]─┘                        verifikasi, AI
     TypeScript                                   |
                                          [ AI abstraction layer ]   (FASE NANTI)
                                           Ollama / server sendiri / API kompatibel-OpenAI
```

> Backend dibuat **API-first**: satu API dipakai bareng oleh web & mobile.
> Karena web & mobile sama-sama TypeScript, tipe data & logic bisa dishare.

Struktur repo (folder **web** dan **mobile** dipisah, sesuai permintaan):
```
RencanaUMKM/
├─ web/           # Next.js (App Router, Tailwind, shadcn/ui)
├─ mobile/        # React Native + Expo (menyusul setelah web jalan)
├─ api/           # Django + DRF
├─ infra/         # docker-compose: postgres + redis
├─ datasets/      # file dataset mentah + script importer
└─ README.md
```

---

## 4. Model Data Inti

| Model | Isi penting |
|---|---|
| `User` | role: `pembeli` / `penjual` / `admin` |
| `Umkm` | slug, nama, kategori, lokasi, range harga, deskripsi, status verifikasi, pemilik (opsional) |
| `UmkmLink` | tipe (`shopee`/`ig`/`wa`/`website`/lain), url, milik `Umkm` |
| `Preference` | minat, budget, lokasi, tujuan — milik pembeli |
| `Recommendation` | token shareable, snapshot input, hasil AI (JSON), timestamp — **dibuat di fase AI** |
| `LinkClick` | umkm_link, recommendation, user, waktu, sumber — basis referral tracking |

Catatan: `Recommendation` & `LinkClick` disiapkan strukturnya, tapi baru dipakai penuh di fase AI.

---

## 5. Jenis Link yang Ditangani

| Path | Fungsi |
|---|---|
| `/umkm/[slug]` | Profil publik UMKM (SEO + OG preview) |
| `/r/[token]` | Hasil rekomendasi AI yang shareable (fase AI) |
| `/go/[id]` | Redirect + catat klik ke Shopee/IG/WA UMKM |
| Referral | Tiap klik dicatat (UMKM mana, dari rekomendasi mana, siapa yang share) → dashboard |

---

## 6. Sumber Dataset (hasil pengecekan)

Sudah dicek beberapa sumber. Kesimpulan: **campuran.**

**Yang BERISI data per-usaha (bagus, bisa langsung dipakai):**
- **data.go.id — Kota Pontianak**: "Data Usaha Mikro Kecil berdasarkan kategori usaha"
  → kolomnya: `No, Nama Pemohon, Nama Usaha, Kegiatan Usaha, Alamat Usaha, Kelurahan Usaha,
  Kecamatan Usaha, Kelompok Usaha, Tahun, Kategori Usaha`. Format XLSX. **Ini contoh yang ideal.**
- **Bank Indonesia — Database UMKM** (bi.go.id, "UMKM layak dibiayai") → profil pengusaha
  (nama perusahaan, lama usaha, alamat, kegiatan usaha). Perlu dicek cara akses datanya.

**Yang cuma AGREGAT/statistik (gak bisa jadi daftar UMKM):**
- data.go.id pada umumnya (mis. Kabupaten Paser, Kabupaten Blitar) → cuma jumlah.
- Open Data Kota Bandung, Jawa Timur → jumlah usaha mikro per jenis usaha.
- BKPM (NIB 2025), Jawa Tengah → jumlah/rekap.

**Kesimpulan praktis:**
- Per-usaha **ADA**, tapi tersebar di portal daerah (contoh terbaik: Pontianak) dan tidak seragam.
- Jadi strategi datanya:
  1. **Ambil dataset per-usaha yang ada** (mulai dari Pontianak) → importer.
  2. **Agregat** dipakai buat validasi sebaran/kategori saja, bukan isi direktori.
  3. **Submission user** (penjual & pembeli) tetap jadi sumber utama pertumbuhan data.
- Perlu dicek lanjutan waktu masuk Fase 1: apakah data.go.id punya endpoint API resmi
  (percobaan `/api/3/action/...` dan `/api/v1/...` hasilnya 404 — kemungkinan ganti cara akses).

**Link sumber:**
- Portal Satu Data Indonesia — https://data.go.id/dataset?q=usaha+mikro
- Open Data daerah: Bandung, Jatim, Jateng, Aceh, Pontianak (via data.go.id)
- Bank Indonesia Database UMKM — https://www.bi.go.id/id/umkm/database/umkm-layak-dibiayai.aspx
- Kumpulan link (lama) — https://github.com/datanesia/government-dataset (isi CSV: daftar portal, bukan data UMKM)

---

## 7. Fase Pengerjaan

### FASE 0 — Fondasi (tanpa AI)
- Setup monorepo: `apps/web`, `apps/api`, `infra/`.
- `docker-compose` buat PostgreSQL + Redis.
- Django + DRF nyala, Next.js nyala, keduanya bisa saling panggil (health check).

### FASE 1 — Direktori UMKM (tanpa AI)
- Model `Umkm` + `UmkmLink`.
- **Django Admin** aktif untuk input/edit/verifikasi data.
- Script importer dataset → draft UMKM.
- Halaman publik `/umkm/[slug]` (SEO + OG).
- Halaman daftar & pencarian/filter UMKM.

### FASE 2 — Dua Sisi (tanpa AI)
- Auth + role (`pembeli`, `penjual`, `admin`).
- Penjual: form daftar UMKM → masuk draft → admin verifikasi.
- Pembeli: form preferensi (minat, budget, lokasi, tujuan).

### FASE 3 — AI Recommender (fase AI, di server sendiri)
- Abstraction layer AI (provider-agnostic) — biar gampang ganti endpoint.
- Alur: preferensi pembeli → filter kandidat UMKM via SQL → kirim ke LLM →
  balikin **JSON terstruktur** (ranking + alasan + langkah lanjut).
- Simpan hasil → generate token → halaman `/r/[token]` shareable + OG preview.
- Redis buat cache hasil rekomendasi.

### FASE 4 — Semua Link + Referral
- `/go/[id]` redirect + pencatatan klik.
- Dashboard referral ringan (berapa klik, dari rekomendasi mana).

### FASE 5 — Mekar
- UMKM klaim profil sendiri.
- Analytics, moderasi lanjutan, peningkatan kualitas rekomendasi.

---

## 8. Hal yang Masih Terbuka (Perlu Diskusi)

- [ ] Dataset mana yang dipakai & seberapa detail isinya (per-usaha vs agregat)?
- [ ] Tujuan rekomendasi sebenarnya: cari partner usaha? investasi? belanja? dibantu digitalisasi?
- [ ] Server yang dipakai untuk AI nanti: speknya apa (CPU/GPU)? → nentuin ukuran model.
- [ ] Skema referral: cuma tracking klik, atau ada reward/komisi?
- [ ] Verifikasi UMKM manual (admin) atau otomatis?

---

## 9. Catatan Penting

- **AI ditunda.** Semua fitur inti (direktori, dua sisi, link, referral) bisa jalan & bisa didemo tanpa AI.
- Struktur `Recommendation` disiapkan dari awal biar nambah AI di Fase 3 nggak perlu bongkar ulang.
- Repo saat ini masih kosong (cuma `README.md`) → greenfield, bebas dibentuk.
