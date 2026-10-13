# RencanaUMKM

Platform direktori & rekomendasi UMKM (ala SAPA UMKM) dengan tambahan AI recommender.

> Status: tahap pembangunan. Fase 0 (fondasi) & Fase 1 (direktori UMKM) selesai.
> **Fitur AI belum dibuat — menunggu server.**

## Struktur

```
RencanaUMKM/
├─ web/        # Next.js  — tampilan web
├─ mobile/     # Expo     — aplikasi HP (menyusul)
├─ api/        # Django   — data, auth, (nanti) AI
├─ infra/      # docker-compose (PostgreSQL + Redis)
├─ datasets/   # file dataset + script importer
└─ docs/       # dokumen rencana
```

---

## Cara Cepat (satu perintah) ⚡

Kalau males ngetik banyak, cukup:

```bash
./start.sh
```

Script ini otomatis: nyalain database → siapkan backend → isi data contoh (kalau kosong) →
jalankan backend & frontend. Terus buka **http://localhost:3000**.

- Berhenti: tekan **Ctrl+C**
- Matikan semua (termasuk database): `./stop.sh`

Butuh Docker, Python 3.11+, dan Node 20+ terinstall. Detail tiap langkah (buat yang mau manual)
ada di bawah.

---

## Cara Menjalankan (manual, langkah demi langkah)

### 0. Prasyarat

| Tool | Versi minimal | Cek |
|---|---|---|
| Docker + Docker Compose | - | `docker -v` |
| Python | 3.11+ | `python3 --version` |
| Node.js | 20+ | `node -v` |

### 1. Nyalakan database (PostgreSQL + Redis)

Dari folder utama `RencanaUMKM/`:

```bash
docker compose -f infra/docker-compose.yml up -d
```

Cek jalan: `docker compose -f infra/docker-compose.yml ps`
(postgres harus `healthy`, redis `Up`)

### 2. Siapkan backend (Django)

```bash
cd api

# bikin virtualenv (cukup sekali)
python3 -m venv venv

# install dependency
./venv/bin/pip install -r requirements.txt

# siapkan file .env
cp .env.example .env

# siapkan tabel database
./venv/bin/python manage.py migrate

# isi data contoh buat tes (6 UMKM) — opsional
./venv/bin/python manage.py seed_umkm

# jalankan server
./venv/bin/python manage.py runserver
```

Backend jalan di **http://127.0.0.1:8000**

### 3. Siapkan frontend (Next.js)

Buka terminal **baru**, dari folder utama:

```bash
cd web

# install dependency
npm install

# siapkan file .env.local
cp .env.example .env.local

# jalankan server
npm run dev
```

Frontend jalan di **http://localhost:3000**

### 4. Selesai — buka di browser

| Halaman | URL |
|---|---|
| Beranda | http://localhost:3000 |
| Daftar UMKM | http://localhost:3000/umkm |
| Contoh profil UMKM | http://localhost:3000/umkm/warung-kopi-sari |
| API (health) | http://127.0.0.1:8000/api/health |
| **Panel admin** | http://127.0.0.1:8000/admin |

> Belum punya akun admin? Bikin dulu:
> ```bash
> cd api && ./venv/bin/python manage.py createsuperuser
> ```

---

## Tutorial: dari nol sampai bisa dipakai 🧭

Ikuti urutannya. Tiap langkah ada "yang harusnya muncul" biar gampang dicek.

### Bagian 1 — Menjalankan aplikasi

1. Buka terminal, masuk ke folder proyek:
   ```bash
   cd RencanaUMKM
   ```
2. Jalankan:
   ```bash
   ./start.sh
   ```
3. Tunggu sampai muncul kotak seperti ini:
   ```
   ======================================================================
     RencanaUMKM sedang jalan!

       Web    : http://localhost:3000
       Admin  : http://127.0.0.1:8000/admin
       API    : http://127.0.0.1:8000/api/health/
   ======================================================================
   ```
   > Biarkan terminal ini tetap terbuka — itu yang menjalankan server. Untuk berhenti: **Ctrl+C**.
4. Buka browser ke **http://localhost:3000**

### Bagian 2 — Jelajahi UMKM (seperti pembeli)

1. Di beranda, klik tombol **"Jelajahi UMKM"** (atau langsung buka http://localhost:3000/umkm).
2. Muncul daftar kartu UMKM, contohnya **Warung Kopi Sari**.
3. **Cari:** di kotak _"Cari nama atau kata kunci…"_, ketik `kopi` → klik **Cari**.
   → Hasilnya tinggal UMKM yang mengandung "kopi".
4. **Filter kategori:** pilih mis. `Kuliner` di dropdown → **Cari**.
5. **Filter harga:** pilih `Murah` → **Cari**. Filter bisa digabung sekaligus.
6. **Kembalikan:** klik **Reset filter** untuk melihat semua lagi.
7. **Buka profil:** klik salah satu kartu → masuk ke halaman profil,
   mis. http://localhost:3000/umkm/warung-kopi-sari
8. Di halaman profil:
   - lihat deskripsi, lokasi, "Berdiri sejak", dan jumlah karyawan
   - klik tombol hijau (Instagram / WhatsApp / Shopee) → terbuka di tab baru
   - klik **"Bagikan link"** → link halaman tersalin, muncul tulisan **"Link disalin!"**.
     Coba paste (Ctrl+V) di chat WhatsApp.
9. **Tes sengaja salah:** cari `zzzz` → muncul _"Gak ada UMKM yang cocok."_
   (Itu wajar — tandanya pencarian bekerja dengan benar.)

### Bagian 3 — Kelola data sebagai admin

Data baru (hasil impor atau pendaftaran) statusnya **Draft** — belum tampil di web publik
sampai kamu verifikasi. Ini yang dikerjakan admin.

1. Bikin akun admin (**sekali saja**):
   ```bash
   cd api
   ./venv/bin/python manage.py createsuperuser
   ```
   Isi username, email (boleh dikosongkan), dan password.
2. Buka http://127.0.0.1:8000/admin lalu login.
3. Klik menu **UMKM** → daftar semua UMKM (termasuk yang masih draft).
4. **Cari/filter:** pakai kotak pencarian dan panel filter di kanan
   (Status, Kategori, Provinsi, Range harga). Coba filter **Status = Draft**.
5. **Tambah manual:** klik **Add UMKM** di kanan atas → isi nama, kategori, deskripsi,
   alamat, dst. Di bagian bawah ada **Links** untuk menambah Instagram/WhatsApp. Simpan.
6. **Verifikasi massal:** centang beberapa UMKM → pilih aksi
   **"Tandai sebagai terverifikasi"** → klik **Go**.
7. Buka lagi http://localhost:3000/umkm → UMKM yang terverifikasi kini tampil. (Refresh kalau belum kelihatan.)
8. Menu **Kategori** untuk menambah atau mengubah kategori usaha.

### Bagian 4 — Impor data dari file (CSV/XLSX)

Cocok untuk memasukkan data banyak sekaligus. Ada file contoh di proyek:
**`datasets/contoh-umkm.csv`**.

1. **Uji dulu (tidak menyimpan apa pun):**
   ```bash
   cd api
   ./venv/bin/python manage.py impor_umkm ../datasets/contoh-umkm.csv \
     --kota Pontianak --provinsi "Kalimantan Barat" --dry-run
   ```
   Yang muncul: daftar nama yang _"akan diimpor"_ beserta totalnya.
2. Kalau sudah cocok, **impor sungguhan** (hapus `--dry-run`, tambahkan `--sumber`):
   ```bash
   ./venv/bin/python manage.py impor_umkm ../datasets/contoh-umkm.csv \
     --kota Pontianak --provinsi "Kalimantan Barat" --sumber dataset:contoh
   ```
3. Cek di admin (http://127.0.0.1:8000/admin → **UMKM**). Semuanya masuk sebagai **Draft**.
4. Lengkapi yang kurang (harga, tahun mulai, jumlah karyawan, link) lalu verifikasi —
   caranya sama seperti Bagian 3.

**Kalau punya file dataset sendiri**, importer akan menebak nama kolomnya otomatis.
Nama kolom yang dikenali:

| Field | Nama kolom yang diterima |
|---|---|
| Nama usaha | `nama usaha`, `nama`, `usaha`, `nama pemohon` |
| Kategori | `kategori usaha`, `jenis usaha`, `bidang usaha`, `kategori` |
| Alamat | `alamat usaha`, `alamat` |
| Kelurahan | `kelurahan`, `desa`, `gampong` |
| Kecamatan | `kecamatan` |
| Kota | `kota`, `kabupaten` |
| Provinsi | `provinsi` |
| Deskripsi | `deskripsi`, `keterangan` |

Kalau kolom kota/provinsi tidak ada di file, isi lewat `--kota` dan `--provinsi`
seperti contoh di atas. Pakai `--dry-run` dulu untuk memastikan kolomnya kebaca.

### Bagian 5 — Berhenti & jalan lagi

| Mau | Perintah |
|---|---|
| Berhenti sementara | tekan **Ctrl+C** di terminal `./start.sh` |
| Matikan semua (termasuk database) | `./stop.sh` |
| Jalanin lagi | `./start.sh` |

### Bagian 6 — Kalau ada masalah

| Gejala | Sebab & solusi |
|---|---|
| Halaman/data gak muncul padahal kode benar | Dev server nyimpen cache lama → berhenti (Ctrl+C) lalu `./start.sh` lagi. |
| `Address already in use` (port 3000/8000) | Server lama masih jalan → `./stop.sh` lalu `./start.sh`. |
| Error koneksi database | Database belum siap → tunggu beberapa detik, atau cek `docker compose -f infra/docker-compose.yml ps`. |
| Mau lihat pesan error detail | `tail -f /tmp/rencanaumkm-api.log /tmp/rencanaumkm-web.log` |
| Lupa password admin | `cd api && ./venv/bin/python manage.py changepassword <username>` |

> ℹ️ **Fitur rekomendasi AI belum ada.** Rencananya ditambahkan setelah server AI siap
> (bisa pakai server sendiri/Ollama maupun layanan OpenAI-compatible). Bagian ini menyusul.

---

## Perintah Berguna (dijalankan di `api/`)

| Perintah | Fungsi |
|---|---|
| `./venv/bin/python manage.py seed_umkm` | Isi 6 data contoh UMKM (aman diulang) |
| `./venv/bin/python manage.py impor_umkm <file>` | Impor UMKM dari file CSV/XLSX |
| `./venv/bin/python manage.py impor_umkm file.csv --dry-run` | Cek dulu tanpa menyimpan |
| `./venv/bin/python manage.py impor_umkm file.csv --publish` | Impor & langsung terverifikasi |
| `./venv/bin/python manage.py createsuperuser` | Bikin akun admin |

Contoh impor dataset:

```bash
./venv/bin/python manage.py impor_umkm ../datasets/pontianak.xlsx \
  --kota Pontianak --provinsi "Kalimantan Barat" --sumber dataset:pontianak
```

Data hasil impor masuk sebagai **draft** (belum tayang publik) sampai diverifikasi
lewat panel admin.

---

## API

| Endpoint | Fungsi |
|---|---|
| `GET /api/health/` | Cek status API + database |
| `GET /api/umkm/` | Daftar UMKM terverifikasi |
| `GET /api/umkm/{slug}/` | Detail satu UMKM |
| `GET /api/kategori/` | Daftar kategori |

Filter daftar UMKM (bisa digabung): `?q=kopi`, `?kategori=kuliner`, `?harga=murah`

---

## Keamanan & File Rahasia 🔒

File yang berisi rahasia **tidak boleh masuk GitHub**. Semuanya sudah diabaikan oleh
`.gitignore`:

| File | Isi | Status |
|---|---|---|
| `api/.env` | SECRET_KEY Django, kredensial database | diabaikan ✅ |
| `web/.env.local` | Alamat API backend | diabaikan ✅ |
| `infra/.env` | Kredensial database (opsional) | diabaikan ✅ |

Yang **ikut di-commit** hanyalah file contoh tanpa rahasia:
`api/.env.example`, `web/.env.example`, `infra/.env.example`.

Cara memastikan (hasilnya harus _"DIABAIKAN"_):

```bash
git check-ignore -v api/.env web/.env.local infra/.env
```

Kalau suatu saat ada rahasia yang **terlanjur** ter-commit: ganti dulu nilainya
(mis. buat `DJANGO_SECRET_KEY` baru), baru bersihkan dari riwayat Git.

---

## Dokumentasi

- [Rencana teknis](docs/rencanaumkm-rencana.md)
- [Fitur & manfaat](docs/rencanaumkm-fitur-dan-manfaat.md)
- [Cara membangun](docs/rencanaumkm-cara-bikin.md)
