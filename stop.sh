#!/usr/bin/env bash
#
# stop.sh — hentikan server RencanaUMKM dan matikan database.
#
#   ./stop.sh
#
set -uo pipefail

cd "$(dirname "$0")"

echo "==> Menghentikan backend (Django) & frontend (Next.js)"
pkill -f "manage.py runserver" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true

echo "==> Mematikan database (Docker)"
docker compose -f infra/docker-compose.yml down

echo "Selesai. Semua sudah dimatikan."
