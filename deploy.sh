#!/usr/bin/env bash
# ============================================================
#  Metal Montaggi — Script di deploy
#  Uso: ./deploy.sh [dev|prod]
# ============================================================
set -euo pipefail

MODE="${1:-prod}"
ENV_FILE=".env"

# ── Verifica .env ────────────────────────────────────────────
if [[ ! -f "$ENV_FILE" ]]; then
  echo "⚠️  File .env non trovato. Copio da .env.example..."
  cp .env.example .env
  echo "✅ .env creato. Modifica i valori prima di procedere in produzione!"
  echo ""
fi

# ── Genera secrets se non impostati ─────────────────────────
generate_secret() {
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))" 2>/dev/null || \
  openssl rand -base64 32
}

echo "🚀 Avvio Metal Montaggi CMS — modalità: $MODE"

if [[ "$MODE" == "dev" ]]; then
  echo "📦 Build e avvio stack di sviluppo (hot-reload)..."
  docker-compose -f docker-compose.dev.yml up --build
else
  echo "📦 Build e avvio stack di produzione..."
  docker-compose up --build -d
  echo ""
  echo "✅ Stack avviato!"
  echo "🌐 Strapi Admin: http://localhost:1337/admin"
  echo "📡 API:          http://localhost:1337/api"
  echo ""
  echo "📋 Logs in tempo reale: docker-compose logs -f strapi"
fi
