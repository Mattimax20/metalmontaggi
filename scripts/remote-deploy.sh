#!/usr/bin/env bash
# Eseguito sul server di produzione via SSH dalla pipeline Jenkins.
set -euo pipefail

DEPLOY_DIR="${1:-/opt/metalmontaggi}"

cd "$DEPLOY_DIR"

# ── .env ────────────────────────────────────────────────────
if [ ! -f .env ]; then
  echo "⚠️  .env non trovato — creazione con valori placeholder"
  cat > .env << 'ENVEOF'
DATABASE_NAME=metalmontaggi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=CAMBIA_ME_password_sicura
DATABASE_PORT=5432
DATABASE_SSL=false
APP_KEYS=CAMBIA_ME_key1,CAMBIA_ME_key2,CAMBIA_ME_key3,CAMBIA_ME_key4
API_TOKEN_SALT=CAMBIA_ME_api_token_salt_32chars
ADMIN_JWT_SECRET=CAMBIA_ME_admin_jwt_secret_32chars
JWT_SECRET=CAMBIA_ME_jwt_secret_32chars
TRANSFER_TOKEN_SALT=CAMBIA_ME_transfer_token_salt
ADMIN_EMAIL=admin@metalmontaggi.it
ADMIN_PASSWORD=MetalMontaggi@2024!
PORT=1337
ENVEOF
  echo "⚠️  ATTENZIONE: modifica $DEPLOY_DIR/.env con i valori reali!"
fi

# ── Docker ───────────────────────────────────────────────────
echo "🐳 Build Docker images..."
docker compose build --no-cache

echo "🚀 Avvio stack..."
docker compose up -d --remove-orphans

echo "⏳ Attesa postgres healthy..."
for i in $(seq 1 12); do
  STATUS=$(docker inspect --format='{{.State.Health.Status}}' metalmontaggi-postgres 2>/dev/null || echo missing)
  if [ "$STATUS" = "healthy" ]; then
    echo "✅ Postgres healthy"
    break
  fi
  echo "  ... ($i/12) $STATUS"
  sleep 5
done

echo ""
echo "✅ Containers:"
docker compose ps
