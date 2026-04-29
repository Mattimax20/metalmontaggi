pipeline {
  agent { label 'prod' }

  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timestamps()
    timeout(time: 30, unit: 'MINUTES')
  }

  environment {
    DEPLOY_DIR    = '/opt/metalmontaggi'
    GIT_REPO      = 'https://github.com/Mattimax20/metalmontaggi.git'
    // BuildKit: builder più veloce, supporta cache mount nei Dockerfile
    DOCKER_BUILDKIT          = '1'
    COMPOSE_DOCKER_CLI_BUILD = '1'
  }

  stages {

    stage('Checkout') {
      steps {
        sh '''
          if [ -d "${DEPLOY_DIR}/.git" ]; then
            # Salva l'hash corrente prima dell'update — serve per capire cosa è cambiato
            echo $(git -C "${DEPLOY_DIR}" rev-parse HEAD) > /tmp/mm_prev_head
            git -C "${DEPLOY_DIR}" fetch origin
            git -C "${DEPLOY_DIR}" reset --hard origin/master
          else
            echo "→ Clone iniziale"
            echo master2024 | sudo -S mkdir -p "${DEPLOY_DIR}"
            echo master2024 | sudo -S chown $(whoami) "${DEPLOY_DIR}"
            git clone "${GIT_REPO}" "${DEPLOY_DIR}"
            # Primo deploy: rebuild tutto
            echo "FIRST" > /tmp/mm_prev_head
          fi
        '''
      }
    }

    stage('Prepare .env') {
      steps {
        sh '''
          if [ ! -f "${DEPLOY_DIR}/.env" ]; then
            echo "⚠️  Creo .env di default"
            cat > "${DEPLOY_DIR}/.env" << 'ENVEOF'
DATABASE_NAME=metalmontaggi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=Str4piSecure!2024
DATABASE_PORT=5432
DATABASE_SSL=false
APP_KEYS=key1abc123456789,key2abc123456789,key3abc123456789,key4abc123456789
API_TOKEN_SALT=apisalt123456789012345678901234
ADMIN_JWT_SECRET=adminjwtsecret1234567890123456
JWT_SECRET=jwtsecret12345678901234567890123
TRANSFER_TOKEN_SALT=transfersalt1234567890123456789
ADMIN_EMAIL=admin@metalmontaggi.it
ADMIN_PASSWORD=MetalMontaggi@2024!
PORT=1337
ENVEOF
          else
            echo "✅ .env già presente"
          fi
        '''
      }
    }

    stage('Detect Changes') {
      steps {
        sh '''
          cd "${DEPLOY_DIR}"
          PREV=$(cat /tmp/mm_prev_head 2>/dev/null || echo "FIRST")

          if [ "$PREV" = "FIRST" ]; then
            echo "🔄 Primo deploy — build completa"
            echo "strapi frontend" > /tmp/mm_rebuild
          else
            CURR=$(git rev-parse HEAD)
            if [ "$PREV" = "$CURR" ]; then
              echo "⚡ Nessun commit nuovo — rebuild forzato ugualmente"
              echo "strapi frontend" > /tmp/mm_rebuild
            else
              CHANGED=$(git diff --name-only "${PREV}" "${CURR}")
              echo "📋 File modificati:"
              echo "$CHANGED"

              REBUILD=""
              echo "$CHANGED" | grep -qE "^frontend/"                      && REBUILD="$REBUILD frontend"
              echo "$CHANGED" | grep -qE "^strapi/"                        && REBUILD="$REBUILD strapi"
              echo "$CHANGED" | grep -qE "^docker-compose|^[.]env|Dockerfile" && REBUILD="strapi frontend"

              # Fallback: se non si capisce cosa è cambiato, rebuild tutto
              [ -z "$(echo $REBUILD | tr -d ' ')" ] && REBUILD="strapi frontend"

              echo "🎯 Servizi da ricompilare: $REBUILD"
              echo "$REBUILD" > /tmp/mm_rebuild
            fi
          fi
        '''
      }
    }

    stage('Build & Deploy') {
      steps {
        sh '''
          cd "${DEPLOY_DIR}"
          REBUILD=$(cat /tmp/mm_rebuild)

          # ── Postgres ────────────────────────────────────────────────────────
          PG_STATUS=$(docker inspect --format="{{.State.Health.Status}}" metalmontaggi-postgres 2>/dev/null || echo missing)
          if [ "$PG_STATUS" = "healthy" ]; then
            echo "✅ Postgres già healthy — skip"
          else
            echo "🐘 Avvio postgres..."
            docker compose up -d postgres
            for i in $(seq 1 12); do
              PG_STATUS=$(docker inspect --format="{{.State.Health.Status}}" metalmontaggi-postgres 2>/dev/null || echo missing)
              [ "$PG_STATUS" = "healthy" ] && echo "✅ Postgres OK" && break
              echo "  ... ($i/12) $PG_STATUS"
              sleep 5
            done
            [ "$PG_STATUS" != "healthy" ] && echo "❌ Postgres non healthy" && exit 1
          fi

          # ── Build ──────────────────────────────────────────────────────────
          # Senza --no-cache: Docker riusa i layer non cambiati (npm install cached).
          # BuildKit + cache mount nel Dockerfile velocizzano ulteriormente.
          echo "🐳 Build: $REBUILD"
          docker compose build $REBUILD

          # ── Deploy ─────────────────────────────────────────────────────────
          echo "🚀 Deploy: $REBUILD"
          docker compose up -d --no-deps $REBUILD

          echo ""
          echo "Containers attivi:"
          docker compose ps
        '''
      }
    }

    stage('Smoke Test') {
      steps {
        sh '''
          REBUILD=$(cat /tmp/mm_rebuild 2>/dev/null || echo "strapi frontend")

          if echo "$REBUILD" | grep -q "strapi"; then
            echo "🔍 Test Strapi API..."
            for i in $(seq 1 6); do
              HTTP=$(curl -sk -o /dev/null -w "%{http_code}" http://localhost:1337/api/informazioni-azienda 2>/dev/null || echo 000)
              [ "$HTTP" = "200" ] && echo "✅ Strapi OK (HTTP 200)" && break
              echo "  ... ($i/6) HTTP $HTTP — attesa 10s"
              sleep 10
            done
          else
            echo "⏭️  Strapi non ricompilato — skip test"
          fi

          if echo "$REBUILD" | grep -q "frontend"; then
            echo "🔍 Test Frontend..."
            HTTP=$(curl -sk -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo 000)
            [ "$HTTP" = "200" ] && echo "✅ Frontend OK (HTTP 200)" || echo "⚠️  Frontend HTTP $HTTP"
          else
            echo "⏭️  Frontend non ricompilato — skip test"
          fi
        '''
      }
    }
  }

  post {
    success {
      sh 'rm -f /tmp/mm_prev_head /tmp/mm_rebuild'
      echo "✅ DEPLOY COMPLETATO — Build #${BUILD_NUMBER}"
    }
    failure {
      sh '''
        echo "❌ DEPLOY FALLITO"
        REBUILD=$(cat /tmp/mm_rebuild 2>/dev/null || echo "strapi frontend")
        cd "${DEPLOY_DIR}"
        echo "$REBUILD" | grep -q "strapi"   && docker compose logs --tail=30 strapi   2>/dev/null || true
        echo "$REBUILD" | grep -q "frontend" && docker compose logs --tail=30 frontend 2>/dev/null || true
        rm -f /tmp/mm_prev_head /tmp/mm_rebuild
      '''
    }
    always {
      cleanWs()
    }
  }
}
