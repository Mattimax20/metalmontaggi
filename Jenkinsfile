pipeline {
  agent any

  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timestamps()
    timeout(time: 20, unit: 'MINUTES')
  }

  environment {
    COMPOSE_PROJECT_NAME = 'metalmontaggi'
    DEPLOY_DIR           = '/opt/metalmontaggi'
    GIT_REPO             = 'https://github.com/Mattimax20/metalmontaggi.git'
  }

  stages {

    // ── 1. Checkout ──────────────────────────────────────
    stage('Checkout') {
      steps {
        git branch: 'master',
            url: "${GIT_REPO}"
      }
    }

    // ── 2. Prepare .env ──────────────────────────────────
    stage('Prepare Environment') {
      steps {
        script {
          // Usa il file .env gestito da Jenkins Credentials o crea uno di default
          sh """
            if [ ! -d "${DEPLOY_DIR}" ]; then
              mkdir -p ${DEPLOY_DIR}
            fi

            # Sincronizza i sorgenti nella DEPLOY_DIR (escludi node_modules e .git)
            rsync -a --delete \
              --exclude='.git' \
              --exclude='node_modules' \
              --exclude='*/node_modules' \
              --exclude='.env' \
              . ${DEPLOY_DIR}/

            # Crea .env di produzione se non esiste
            if [ ! -f "${DEPLOY_DIR}/.env" ]; then
              echo "⚠️  .env non trovato — creazione con valori di default sicuri"
              cat > ${DEPLOY_DIR}/.env << 'ENVEOF'
DATABASE_NAME=metalmontaggi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=CAMBIA_ME_password_sicura
DATABASE_PORT=5432
DATABASE_SSL=false
APP_KEYS=CAMBIA_ME_key1,CAMBIA_ME_key2,CAMBIA_ME_key3,CAMBIA_ME_key4
API_TOKEN_SALT=CAMBIA_ME_api_token_salt
ADMIN_JWT_SECRET=CAMBIA_ME_admin_jwt_secret
JWT_SECRET=CAMBIA_ME_jwt_secret
TRANSFER_TOKEN_SALT=CAMBIA_ME_transfer_token_salt
ADMIN_EMAIL=admin@metalmontaggi.it
ADMIN_PASSWORD=MetalMontaggi@2024!
PORT=1337
ENVEOF
              echo "✅ .env creato in ${DEPLOY_DIR}/.env — MODIFICA I VALORI PRIMA DEL PROSSIMO DEPLOY!"
            else
              echo "✅ .env esistente trovato"
            fi
          """
        }
      }
    }

    // ── 3. Build & Deploy ─────────────────────────────────
    stage('Build & Deploy') {
      steps {
        sh """
          cd ${DEPLOY_DIR}
          echo "🐳 Build immagini Docker..."
          docker compose build --no-cache

          echo "🚀 Avvio stack..."
          docker compose up -d --remove-orphans

          echo "⏳ Attesa avvio Strapi (max 60s)..."
          for i in \$(seq 1 12); do
            STATUS=\$(docker inspect --format='{{.State.Health.Status}}' metalmontaggi-postgres 2>/dev/null || echo 'missing')
            if [ "\$STATUS" = "healthy" ]; then
              echo "✅ Postgres healthy"
              break
            fi
            echo "  ... attesa postgres (\$i/12)"
            sleep 5
          done
        """
      }
    }

    // ── 4. Smoke Test ────────────────────────────────────
    stage('Smoke Test') {
      steps {
        sh """
          echo "🔍 Controllo container attivi..."
          docker compose -p ${COMPOSE_PROJECT_NAME} ps

          echo ""
          echo "🔍 Test API Strapi..."
          for i in \$(seq 1 6); do
            HTTP=\$(curl -sk -o /dev/null -w '%{http_code}' http://localhost:1337/api/informazioni-azienda?populate=* || echo '000')
            if [ "\$HTTP" = "200" ]; then
              echo "✅ Strapi API risponde (HTTP 200)"
              break
            fi
            echo "  ... Strapi non ancora pronto (\$i/6, HTTP \$HTTP)"
            sleep 10
          done

          echo ""
          echo "🔍 Test Frontend..."
          HTTP=\$(curl -sk -o /dev/null -w '%{http_code}' http://localhost:3000 || echo '000')
          if [ "\$HTTP" = "200" ]; then
            echo "✅ Frontend risponde (HTTP 200)"
          else
            echo "⚠️  Frontend HTTP \$HTTP"
          fi
        """
      }
    }

  }

  post {
    success {
      echo """
        ✅ DEPLOY COMPLETATO CON SUCCESSO
        ─────────────────────────────────
        🌐 Frontend:    http://localhost:3000
        ⚙️  Strapi API: http://localhost:1337/api
        🔑 Admin CMS:  http://localhost:1337/admin
        ─────────────────────────────────
        Build: #${BUILD_NUMBER} | Branch: master
      """
    }
    failure {
      echo "❌ DEPLOY FALLITO — controlla i log sopra"
      sh """
        cd ${DEPLOY_DIR} || true
        echo "=== docker compose ps ==="
        docker compose ps || true
        echo "=== ultimi log strapi ==="
        docker compose logs --tail=50 strapi || true
      """
    }
    always {
      cleanWs()
    }
  }
}
