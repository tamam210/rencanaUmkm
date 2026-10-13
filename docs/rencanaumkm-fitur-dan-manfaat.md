# Rencana Fitur & Manfaat — RencanaUMKM

> Dokumen pendamping dari `rencanaumkm-rencana.md`
> Fokus: **apa yang mau dibikin**, **hasil/manfaatnya buat pemakai**, dan **rencana integrasi server AI (nanti)**.
> Prinsip: **AI belum dibuat.** Tunggu server siap dulu.

---

## 1. Siapa "Pemakai"-nya?

Ada 4 jenis pemakai. Manfaat harus jelas buat masing-masing.

| Peran | Siapa | Kebutuhan utama |
|---|---|---|
| **Pembeli / Pencari** | Orang yang mau belanja, cari partner usaha, atau cari tempat investasi | Dapat rekomendasi UMKM yang cocok tanpa ribet nyari sendiri |
| **Penjual / Pemilik UMKM** | Pelaku usaha mikro, kecil, menengah | Promosi gratis, dapat pembeli/partner, kelola profilnya |
| **Admin** | Pengelola platform | Kelola & verifikasi data, jaga kualitas |
| **Pengunjung Umum** | Orang yang buka link yang di-share | Lihat profil UMKM / hasil rekomendasi tanpa harus daftar |

---

## 2. Daftar yang Mau Dibikin (per Fase)

### FASE 0 — Fondasi
- [ ] Struktur monorepo (`apps/web`, `apps/api`, `infra`)
- [ ] Docker Compose: PostgreSQL + Redis
- [ ] Backend Django + DRF nyala
- [ ] Frontend Next.js nyala
- [ ] Keduanya bisa saling panggil (health check)

### FASE 1 — Direktori UMKM
**Urutan pengerjaan (diputuskan):**
1. Model data + Django Admin + importer  → biar ada data yang bisa ditampilin
2. Halaman profil publik `/umkm/[slug]` + link share  → inti yang bisa didemoin
3. Daftar UMKM + pencarian & filter

- [ ] Model data UMKM (nama, slug, kategori, lokasi, harga, deskripsi, kontak)
- [ ] Model link UMKM (Shopee / Instagram / WhatsApp / Website)
- [ ] Django Admin untuk kelola & verifikasi data
- [ ] Script importer dataset → draft UMKM
- [ ] Halaman publik profil UMKM: `/umkm/[slug]`
- [ ] Halaman daftar UMKM + pencarian & filter (kategori, lokasi, harga)
- [ ] Untuk tiap halaman: meta SEO + gambar preview (Open Graph)

### FASE 2 — Dua Sisi
- [ ] Auth + role (`pembeli`, `penjual`, `admin`)
- [ ] Penjual: form daftar UMKM → masuk draft → diverifikasi admin
- [ ] Penjual: dashboard kelola profil usahanya
- [ ] Pembeli: form preferensi (minat, budget, lokasi, tujuan)
- [ ] **Boleh dicoba tanpa login** (login cuma buat simpan)
- [ ] Admin: halaman verifikasi submission

### FASE 2B — Aplikasi Mobile (menyusul, web dulu)
- [ ] Setup React Native + Expo (satu bahasa: TypeScript)
- [ ] Pakai API yang sama dengan web (gak bikin backend baru)
- [ ] Layar utama: daftar UMKM, pencarian, profil UMKM
- [ ] Layar preferensi → rekomendasi
- [ ] Deep link (biar link share `/umkm/...` bisa kebuka di app)
- [ ] (Nanti) push notification

### FASE 3 — Link & Referral
- [ ] Redirect keluar: `/go/[id]` + catat klik
- [ ] Dashboard referral (berapa klik, dari mana)
- [ ] (Opsional) kode referral per pembeli/pemilik

### FASE 4 — AI Recommender *(TUNGGU SERVER SIAP)*
- [ ] Abstraction layer AI (provider-agnostic)
- [ ] Sambungin ke server AI (Ollama / endpoint kompatibel-OpenAI)
- [ ] Alur: preferensi pembeli → filter kandidat UMKM → kirim ke AI → hasil JSON
- [ ] Hasil: ranking + alasan ("kenapa UMKM ini") + langkah lanjut
- [ ] Halaman hasil shareable: `/r/[token]` + Open Graph
- [ ] Cache hasil di Redis biar hemat & cepat

### FASE 5 — Mekar
- [ ] UMKM klaim profil sendiri
- [ ] Analytics & laporan
- [ ] Moderasi lanjutan

---

## 3. Hasil / Manfaat buat Tiap Pemakai

### 3.1 Pembeli / Pencari
- **Gak perlu nyari manual.** Tinggal isi preferensi → langsung dikasih daftar UMKM yang cocok.
- **Ada alasannya.** Bukan cuma daftar kosong, tapi "kenapa kamu cocok sama UMKM ini".
- **Bisa dishare.** Hasil rekomendasinya punya link sendiri → bisa dikirim ke teman/keluarga.
- **Bisa langsung gas.** Ada link ke Shopee/IG/WA UMKM → tiap rekomendasi bisa langsung ditindaklanjuti.

### 3.2 Penjual / Pemilik UMKM
- **Promosi gratis.** Usahanya masuk direktori, bisa ketemu calon pembeli.
- **Ditemukan lewat pencarian.** Orang yang cari kategori/lokasi yang sesuai bakal ketemu.
- **Link profil sendiri.** Bisa dijadiin "kartu nama online" yang gampang dishare.
- **Kelola sendiri.** Ganti harga/deskripsi/medsos kapan aja.
- **Data klik.** Keliatan berapa orang yang klik linknya (nanti di fase referral).

### 3.3 Admin
- **Kelola gampang.** Input/verifikasi UMKM tinggal dari panel admin (Django Admin), gak perlu coding.
- **Kualitas terjaga.** Cuma data yang diverifikasi yang tayang.
- **Import massal.** Dataset bisa dimasukin sekaligus lewat script importer.

### 3.4 Pengunjung Umum
- **Lihat tanpa daftar.** Buka link yang di-share → langsung lihat profil UMKM atau hasil rekomendasi.
- **Preview jelas.** Pas link dikirim di WA/IG, muncul judul + gambar preview yang rapi.

---

## 4. Rencana Integrasi Server AI (NANTI)

> Belum dikerjain sekarang. Ini catatan biar nanti gampang.

**Situasi:** AI dijalankan di **server sendiri**, lalu disambungkan ke aplikasi ini.

**Yang perlu disiapin di sisi aplikasi (biar tinggal colok):**
- Abstraction layer AI: satu modul yang jadi "pintu" ke AI. Ganti otak AI = ubah konfigurasi, bukan ubah kode fitur.
- Konfigurasi lewat environment variable:
  - `AI_BASE_URL` — alamat server AI (mis. `http://ip-server:11434`)
  - `AI_MODEL` — nama model
  - `AI_API_KEY` — kalau perlu
- Format output AI: **JSON terstruktur** (bukan teks bebas) biar bisa ditampilin rapi.
- Timeout & fallback: kalau server AI mati/lambat, aplikasi tetap jalan (kasih pesan "sedang tidak tersedia").

**Opsi cara AI di server (nanti dipilih pas servernya udah ada):**
| Opsi | Cara jalan | Cocok kalau |
|---|---|---|
| Ollama (paling gampang) | Install Ollama di server, jalanin model, tembak via API-nya | Mau cepat mulai, server lumayan kuat |
| Docker + vLLM / llama.cpp | Model jalan dalam container, API kompatibel-OpenAI | Mau lebih terkontrol / performa |
| Pakai API pihak ketiga | Sementara nyewa, sebelum server siap | Cuma buat tes cepat (opsional, gratis ada) |

**Kunci:** asal interface-nya kompatibel-OpenAI, mau Ollama/vLLM/docker apa pun, aplikasi gak perlu diubah.

**Yang gw butuh pas server udah ada:**
1. Alamat/IP server + akses (SSH?) 
2. Spek server (CPU/RAM/GPU?) → nentuin besar model
3. Server mau diakses dari internet atau cuma lokal?

---

## 5. Yang Harus Dilakukan Setelah Ini (Checklist)

**Sekarang (tanpa server, tanpa AI):**
- [ ] Finalisasi rencana & fitur
- [ ] Tentukan dataset mana yang dipakai (cek isi datanya detail apa agregat)
- [ ] Sepakati model data (field UMKM apa aja)
- [ ] Mulai bangun Fase 0–1 (fondasi + direktori)
- [ ] Bangun Fase 2 (dua sisi)
- [ ] Bangun Fase 2B (aplikasi mobile — setelah web jalan)
- [ ] Bangun Fase 3 (link & referral)

**Nanti (pas server udah ada):**
- [ ] Siapin server AI (install & jalanin model)
- [ ] Tes endpoint AI dari luar
- [ ] Colok ke aplikasi (isi `AI_BASE_URL` dkk)
- [ ] Bangun & tes Fase 4 (AI recommender + link shareable)
- [ ] Evaluasi kualitas rekomendasi

---

## 6. Pertanyaan Diskusi (Banyak)

### ✅ Sudah dijawab
- **Tujuan rekomendasi:** campur — user pilih sendiri saat isi preferensi.
- **Wajib login?** Boleh coba tanpa login; login cuma buat simpan riwayat/profil.
- **Bentuk aplikasi:** web + mobile.
- **Urutan:** web dulu → mobile menyusul. Folder **web** dan **mobile** dipisah.
- **Mobile pakai apa:** rekomendasi → **React Native + Expo** (alasan: paling mudah buat pemula + bahasa sama dengan web). ✅ **Disetujui.**
- **Data UMKM:** cek semua sumber dulu → hasilnya nanti di bawah.
- **Hasil cek dataset:** campuran! Mayoritas agregat, tapi ada yang **per-usaha**
  (contoh terbaik: Kota Pontianak — ada nama usaha, alamat, kelurahan, kecamatan, kategori).
- **Prioritas Fase 1:** diputuskan → **model data + admin + importer → profil publik + link share → daftar/pencarian.**
- **Dataset pilot:** belum dijawab → *default sementara*: **Kota Pontianak** (bisa diganti nanti).

### Masih terbuka

### Soal produk
1. ~~Tujuan rekomendasi intinya apa?~~ → **campur (user pilih sendiri)**
2. ~~Pembeli wajib login dulu baru dapat rekomendasi, atau boleh coba tanpa login?~~ → **boleh tanpa login**
3. Hasil rekomendasi cukup 1x, atau ada riwayat?
4. Perlu rating/ulasan UMKM dari pengguna gak?
5. Bahasa: cuma Indonesia, atau perlu multi-bahasa?

### Soal data
6. Dataset mana yang dipakai? Isinya detail atau cuma statistik?
7. Field UMKM apa aja yang wajib? (nama, kategori, lokasi, harga, kontak, foto?)
8. Perlu lokasi presisi (peta/koordinat) gak?
9. Kategori usaha pakai standar tertentu (KBLI) atau bebas?
10. UMKM tanpa NIB boleh masuk gak?
11. Butuh upload foto/produk gak?

### Soal aplikasi
12. ~~Perlu aplikasi mobile (Android/iOS), atau web aja dulu?~~ → **web + mobile**
13. Perlu notifikasi (email/WA) gak?
14. Perlu peta/maps gak?
15. Perlu multi-bahasa/aksesibilitas?
16. Skala target: berapa UMKM & berapa user yang dibayangin?

### Soal referral
17. Referral cuma tracking klik, atau ada komisi/reward beneran?
18. Kalau ada reward, bentuknya apa? (uang, poin, badge?)
19. Siapa yang dapat reward: yang share atau yang beli?

### Soal AI (nanti)
20. Model AI apa yang mau? (ditentukan pas tau spek server)
21. Server AI boleh diakses dari internet, atau cuma internal?
22. Kalau server AI mati, aplikasi harus tetap jalan — oke kan pakai fallback?
23. Rekomendasi AI perlu bisa dibaca manusia ("kenapa") atau cukup skor angka?

### Soal operasional
24. Siapa yang jadi admin & verifikasi data?
25. Hosting aplikasi di mana? (server yang sama atau beda?)
26. Nama domain final?
27. Perlu dokumentasi buat user awam gak?

---

## 7. Catatan

- **AI belum disentuh sama sekali** di dokumen ini — semua fitur Fase 0–3 jalan tanpa AI.
- Struktur data buat AI (hasil rekomendasi, klik) disiapin dari awal biar nambah AI gak bongkar ulang.
- Repo masih kosong → semua masih bebas dibentuk.
