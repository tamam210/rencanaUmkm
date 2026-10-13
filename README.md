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

## Cara Menjalankan (lokal)

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

## Dokumentasi

- [Rencana teknis](docs/rencanaumkm-rencana.md)
- [Fitur & manfaat](docs/rencanaumkm-fitur-dan-manfaat.md)
- [Cara membangun](docs/rencanaumkm-cara-bikin.md)
