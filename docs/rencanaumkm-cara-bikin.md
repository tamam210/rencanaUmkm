# Cara Membangun RencanaUMKM — Panduan Langkah demi Langkah

> Dokumen pendamping dari `rencanaumkm-rencana.md` dan `rencanaumkm-fitur-dan-manfaat.md`.
> Isi: **langkah praktis** buat mbangun, dari nol sampai jalan.
> Status: **belum dieksekusi.** AI ditunda (nunggu server).

---

## 0. Prasyarat (yang perlu terinstall di komputer)

| Tool | Buat apa | Cek dengan |
|---|---|---|
| Git | versi & simpan kode | `git --version` |
| Node.js (LTS) | jalanin Next.js & Expo | `node -v` |
| Python 3.11+ | jalanin Django | `python --version` |
| Docker + Docker Compose | jalanin PostgreSQL & Redis | `docker -v` |
| VS Code (atau editor lain) | nulis kode | — |

> Kalau ada yang belum keinstall, tinggal tanya, gw bantu caranya.

---

## 1. Struktur folder yang dituju

```
RencanaUMKM/
├─ web/           # Next.js  (tampilan web)
├─ mobile/        # Expo     (aplikasi HP, menyusul)
├─ api/           # Django   (otak: data, auth, nanti AI)
├─ infra/         # docker-compose.yml (Postgres + Redis)
├─ datasets/      # file dataset mentah + script importer
├─ docs/          # dokumen rencana ini
└─ README.md
```

---

## 2. FASE 0 — Fondasi

**Tujuan:** Django, Next.js, PostgreSQL, Redis semuanya nyala dan bisa saling ngobrol.

**Langkah:**
1. Buat folder `web/`, `mobile/`, `api/`, `infra/`, `datasets/`, `docs/`.
2. Di `infra/`, buat `docker-compose.yml` berisi PostgreSQL + Redis.
3. Nyalain: `docker compose up -d`.
4. Di `api/`, setup Django:
   - bikin virtualenv, install `django`, `djangorestframework`, `psycopg`, `redis`.
   - `django-admin startproject` → app utama.
   - setting koneksi ke Postgres + Redis.
   - bikin endpoint tes: `/api/health/`.
5. Di `web/`, setup Next.js:
   - `npx create-next-app@latest` (TypeScript + Tailwind).
   - bikin halaman yang manggil `/api/health/` → kalau muncul "OK", berarti web & api udah nyambung.
6. Tes semua nyala sekaligus.

**Selesai kalau:** buka web di browser → tampil "API OK".

---

## 3. FASE 1 — Direktori UMKM

**Tujuan:** ada data UMKM, ada halaman publiknya, bisa dishare.

**Urutan (yang udah diputusin):**

**1) Data + Admin + Importer**
- Di `api/`, buat app `umkm`.
- Bikin model `Umkm` & `UmkmLink` (lihat field di dokumen fitur).
- Migrasi ke database.
- Daftarkan ke Django Admin → biar bisa input/verifikasi lewat panel.
- Bikin script importer di `datasets/` buat masukin data dari file dataset (pilot: Kota Pontianak).

**2) Halaman profil publik**
- Di `web/`, bikin halaman `/umkm/[slug]`.
- API-nya: `GET /api/umkm/{slug}/`.
- Tambah meta SEO + gambar preview (Open Graph) biar link-nya cakep pas di-share.

**3) Daftar & pencarian**
- Halaman daftar UMKM + pencarian & filter (kategori, lokasi, harga).
- API-nya: `GET /api/umkm/?kategori=...&lokasi=...`.

**Selesai kalau:** bisa buka satu UMKM lewat link, dan link-nya muncul preview pas dikirim di WhatsApp.

---

## 4. FASE 2 — Dua Sisi

**Tujuan:** penjual bisa daftar & kelola UMKM; pembeli bisa isi preferensi.

- Auth + role (`pembeli`, `penjual`, `admin`).
- Form daftar UMKM (penjual) → masuk `draft` → admin verifikasi.
- Dashboard penjual (edit profil usaha).
- Form preferensi pembeli (tujuan, kategori, budget, lokasi, catatan).
- **Tanpa login boleh nyoba** — hasil disimpan sementara pakai token anonim.

**Selesai kalau:** penjual bisa daftar dan admin bisa approve; pembeli bisa isi preferensi.

---

## 5. FASE 2B — Aplikasi Mobile (setelah web jalan)

- Di `mobile/`, setup Expo: `npx create-expo-app@latest`.
- Bikin layar: daftar UMKM, pencarian, profil UMKM, form preferensi.
- Pakai **API yang sama** dengan web (gak bikin backend baru).
- Tes di HP pakai app **Expo Go** (scan QR).
- Deep link (biar link share `/umkm/...` bisa kebuka di app).

**Selesai kalau:** app jalan di HP dan bisa lihat daftar UMKM.

---

## 6. FASE 3 — Link & Referral

- Endpoint redirect: `/go/{id}` → catat klik → arahin ke Shopee/IG/WA.
- Simpan tiap klik di database (UMKM mana, dari mana, kapan).
- Dashboard ringan: berapa klik per UMKM.

---

## 7. FASE 4 — AI Recommender *(TUNGGU SERVER SIAP)*

- Bikin **abstraction layer AI** (satu modul khusus buat manggil AI).
- Config lewat file `.env`: `AI_BASE_URL`, `AI_MODEL`, `AI_API_KEY`.
- Pas server udah ada: tentukan model → tes endpoint → isi config → jalan.
- Alur: preferensi pembeli → filter kandidat UMKM → kirim ke AI → hasil JSON → simpan.
- Halaman hasil shareable: `/r/[token]`.
- Cache hasil di Redis.

**Selesai kalau:** isi preferensi → keluar saran UMKM + alasannya + link shareable.

---

## 8. Konfigurasi (.env)

Tiap app punya file `.env` sendiri (isinya rahasia, **jangan** masuk Git).

**api/.env**
```
DATABASE_URL=postgres://...       # koneksi Postgres
REDIS_URL=redis://...             # koneksi Redis
SECRET_KEY=...                    # kunci rahasia Django
# isi ini NANTI, pas server AI siap:
AI_BASE_URL=
AI_MODEL=
AI_API_KEY=
```

**web/.env**
```
NEXT_PUBLIC_API_URL=http://localhost:8000   # alamat backend
```

> Sediakan juga `.env.example` (isinya kosong/contoh) yang **boleh** masuk Git,
> biar gampang dibagiin tanpa bocorin rahasia.

---

## 9. Cara menjalankan (nanti, setelah dibangun)

```
# 1. Nyalain database & redis
docker compose -f infra/docker-compose.yml up -d

# 2. Backend
cd api && source venv/bin/activate && python manage.py runserver

# 3. Web
cd web && npm run dev

# 4. Mobile (opsional)
cd mobile && npx expo start
```

---

## 10. Alur Kerja Git

- Tiap selesai satu bagian kecil → commit. Jangan numpuk.
- Pesan commit jelas, contoh: `feat: halaman profil UMKM`, `fix: filter lokasi`.
- Bikin branch buat fitur baru: `git checkout -b fitur-pencarian`.

---

## 11. Urutan Besar (ringkasan)

```
Fase 0  Fondasi (Docker + Django + Next.js)        ← MULAI DI SINI
Fase 1  Direktori UMKM + halaman shareable
Fase 2  Dua sisi (auth, daftar, preferensi)
Fase 2B Mobile (Expo)
Fase 3  Link & referral
───────  (nunggu server)  ───────
Fase 4  AI recommender                           ← NANTI
Fase 5  Mekar (klaim profil, analytics)
```

---

## 12. Yang Perlu Dilakukan Pas Mau Mulai

1. **Ganti agent ke mode implementasi** (di mode ini cuma bisa rencana).
2. Pindahin `/home/t-n-r-p-w/.opencode/plan/*.md` ke `RencanaUMKM/docs/`.
3. Install prasyarat (bagian 0).
4. Mulai Fase 0.

---

## 13. Catatan

- **Jangan sentuh AI dulu.** Semua Fase 0–3 jalan tanpa AI.
- Kalau ada istilah yang bingung, tanya aja — gak ada yang "harus udah tau".
- Bangun pelan tapi jalan > bangun banyak tapi mandek.
