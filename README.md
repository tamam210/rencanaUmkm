# RencanaUMKM

Platform direktori & rekomendasi UMKM (ala SAPA UMKM) dengan tambahan AI recommender.

> Status: **tahap pembangunan Fase 0 (fondasi).** Bagian AI belum dibuat — menunggu server.

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

## Dokumentasi

- [Rencana teknis](docs/rencanaumkm-rencana.md)
- [Fitur & manfaat](docs/rencanaumkm-fitur-dan-manfaat.md)
- [Cara membangun](docs/rencanaumkm-cara-bikin.md)
