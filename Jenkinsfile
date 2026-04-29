pipeline {
  // Gira direttamente sul server di produzione (10.0.0.5)
  // dove Docker è installato e disponibile
  agent { label 'prod' }

  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timestamps()
    timeout(time: 30, unit: 'MINUTES')
  }

  environment {
    DEPLOY_DIR = '/opt/metalmontaggi'
    GIT_REPO   = 'https://github.com/Mattimax20/metalmontaggi.git'
  }

  stages {

    stage('Checkout') {
      steps {
        // Clona il repo nella DEPLOY_DIR
        sh '''
          if [ -d "${DEPLOY_DIR}/.git" ]; then
            echo "→ Aggiorno repo esistente"
            git -C "${DEPLOY_DIR}" fetch origin
            git -C "${DEPLOY_DIR}" reset --hard origin/master
          else
            echo "→ Clone iniziale"
            echo master2024 | sudo -S mkdir -p "${DEPLOY_DIR}"
            echo master2024 | sudo -S chown $(whoami) "${DEPLOY_DIR}"
            git clone "${GIT_REPO}" "${DEPLOY_DIR}"
          fi
        '''
      }
    }

    stage('Prepare .env') {
      steps {
        sh '''
          if [ ! -f "${DEPLOY_DIR}/.env" ]; then
            echo "⚠️  Creo .env di default — modifica i valori reali in ${DEPLOY_DIR}/.env"
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

    stage('Build & Deploy') {
      steps {
        sh '''
          cd "${DEPLOY_DIR}"

          # ── Postgres: avvia solo se non è già healthy ──────────────────────
          # MAI riavviare postgres se contiene dati: il volume Docker persiste,
          # ma un restart inutile causa downtime. Non usare mai "docker compose down -v".
          PG_STATUS=$(docker inspect --format="{{.State.Health.Status}}" metalmontaggi-postgres 2>/dev/null || echo missing)
          if [ "$PG_STATUS" = "healthy" ]; then
            echo "✅ Postgres già healthy — non verrà riavviato"
          else
            echo "🐘 Avvio postgres..."
            docker compose up -d postgres
            for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
              PG_STATUS=$(docker inspect --format="{{.State.Health.Status}}" metalmontaggi-postgres 2>/dev/null || echo missing)
              [ "$PG_STATUS" = "healthy" ] && echo "✅ Postgres OK" && break
              echo "  ... ($i/12) $PG_STATUS"
              sleep 5
            done
            if [ "$PG_STATUS" != "healthy" ]; then
              echo "❌ Postgres non è diventato healthy — abort"
              exit 1
            fi
          fi

          # ── Build solo strapi e frontend (postgres usa image, non ha build) ─
          echo "🐳 Build Docker images (strapi + frontend)..."
          docker compose build --no-cache strapi frontend

          # ── Riavvia strapi e frontend senza toccare postgres ───────────────
          echo "🚀 Deploy strapi + frontend..."
          docker compose up -d --no-deps strapi frontend

          echo ""
          echo "Containers attivi:"
          docker compose ps
        '''
      }
    }

    stage('Smoke Test') {
      steps {
        sh '''
          echo "🔍 Test Strapi API..."
          for i in 1 2 3 4 5 6; do
            HTTP=$(curl -sk -o /dev/null -w "%{http_code}" http://localhost:1337/api/informazioni-azienda 2>/dev/null || echo 000)
            if [ "$HTTP" = "200" ]; then
              echo "✅ Strapi OK (HTTP 200)"
              break
            fi
            echo "  ... ($i/6) HTTP $HTTP — attesa 10s"
            sleep 10
          done

          echo "🔍 Test Frontend..."
          HTTP=$(curl -sk -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo 000)
          if [ "$HTTP" = "200" ]; then
            echo "✅ Frontend OK (HTTP 200)"
          else
            echo "⚠️  Frontend HTTP $HTTP"
          fi
        '''
      }
    }
  }

  post {
    success {
      echo "✅ DEPLOY COMPLETATO — Build #${BUILD_NUMBER} — master"
    }
    failure {
      sh '''
        echo "❌ DEPLOY FALLITO — log Strapi:"
        cd "${DEPLOY_DIR}" && docker compose logs --tail=40 strapi 2>/dev/null || true
      '''
    }
    always {
      cleanWs()
    }
  }
}
