#!/usr/bin/env bash
#
# start.sh — jalankan SEMUA yang dibutuhkan RencanaUMKM dengan satu perintah.
#
#   ./start.sh
#
# Yang dilakukan: nyalain database -> siapkan & jalankan backend -> siapkan & jalankan frontend.
# Berhenti: tekan Ctrl+C. Mematikan database: ./stop.sh
#
set -euo pipefail

cd "$(dirname "$0")"
ROOT="$(pwd)"

info() { printf "\n\033[1;32m==> %s\033[0m\n" "$1"; }
warn() { printf "\033[1;33m!! %s\033[0m\n" "$1"; }

# --- 0. cek prasyarat ---
for cmd in docker python3 npm; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    warn "Butuh '$cmd' tapi tidak ketemu. Install dulu ya."
    exit 1
  fi
done

# --- 1. database ---
info "Menyalakan database (PostgreSQL + Redis)"
docker compose -f infra/docker-compose.yml up -d

info "Menunggu database siap"
for _ in $(seq 1 30); do
  if docker compose -f infra/docker-compose.yml exec -T db pg_isready -U sensory -d sensory >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

# --- 2. backend ---
info "Menyiapkan backend (Django)"
cd "$ROOT/api"
if [ ! -d venv ]; then
  python3 -m venv venv
  ./venv/bin/pip install -q --upgrade pip
fi
./venv/bin/pip install -q -r requirements.txt
[ -f .env ] || cp .env.example .env
./venv/bin/python manage.py migrate --noinput >/dev/null

if ./venv/bin/python manage.py shell -c "from umkm.models import Umkm; raise SystemExit(0 if Umkm.objects.exists() else 1)" >/dev/null 2>&1; then
  :
else
  info "Mengisi data contoh UMKM"
  ./venv/bin/python manage.py seed_umkm
fi

# --- 3. frontend ---
info "Menyiapkan frontend (Next.js)"
cd "$ROOT/web"
[ -d node_modules ] || npm install
[ -f .env.local ] || cp .env.example .env.local

# --- 4. jalankan ---
info "Menjalankan server…"
cd "$ROOT/api"
./venv/bin/python manage.py runserver >/tmp/rencanaumkm-api.log 2>&1 &
API_PID=$!

cd "$ROOT/web"
npm run dev >/tmp/rencanaumkm-web.log 2>&1 &
WEB_PID=$!

bersihin() {
  echo
  info "Menghentikan server…"
  kill "$API_PID" "$WEB_PID" 2>/dev/null || true
  wait 2>/dev/null || true
  echo "Selesai. Database (Docker) masih jalan. Matikan dengan: ./stop.sh"
}
trap bersihin INT TERM

echo
echo "======================================================================"
echo "  RencanaUMKM sedang jalan!"
echo
echo "    Web    : http://localhost:3000"
echo "    Admin  : http://127.0.0.1:8000/admin"
echo "    API    : http://127.0.0.1:8000/api/health/"
echo
echo "  Lihat log : tail -f /tmp/rencanaumkm-api.log /tmp/rencanaumkm-web.log"
echo "  Stop      : tekan Ctrl+C"
echo "======================================================================"

wait
