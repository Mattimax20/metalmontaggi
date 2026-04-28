pipeline {
  agent any

  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timestamps()
    timeout(time: 20, unit: 'MINUTES')
  }

  environment {
    COMPOSE_PROJECT_NAME = 'metalmontaggi'
    GIT_REPO             = 'https://github.com/Mattimax20/metalmontaggi.git'
    // Impostare in Jenkins → Manage Jenkins → System → Global properties:
    //   DEPLOY_HOST  = IP o hostname del server di produzione
    //   DEPLOY_USER  = utente SSH (es. root oppure ubuntu)
    //   DEPLOY_DIR   = percorso sul server (es. /opt/metalmontaggi)
  }

  stages {

    // ── 1. Checkout ──────────────────────────────────────
    stage('Checkout') {
      steps {
        git branch: 'master', url: "${GIT_REPO}"
      }
    }

    // ── 2. Deploy via SSH ─────────────────────────────────
    stage('Deploy') {
      steps {
        // Usa la credential SSH creata in Jenkins con ID "deploy-server-ssh"
        sshagent(credentials: ['deploy-server-ssh']) {
          sh """
            set -e

            DEPLOY_HOST=\${DEPLOY_HOST:-"CONFIGURA_IP_SERVER"}
            DEPLOY_USER=\${DEPLOY_USER:-"root"}
            DEPLOY_DIR=\${DEPLOY_DIR:-"/opt/metalmontaggi"}

            echo "🚀 Deploy su \${DEPLOY_USER}@\${DEPLOY_HOST}:\${DEPLOY_DIR}"

            # Crea directory se non esiste
            ssh -o StrictHostKeyChecking=no \${DEPLOY_USER}@\${DEPLOY_HOST} "mkdir -p \${DEPLOY_DIR}"

            # Sincronizza sorgenti (escludi file grandi/inutili)
            rsync -az --delete \
              --exclude='.git' \
              --exclude='node_modules' \
              --exclude='*/node_modules' \
              --exclude='.env' \
              --exclude='public/uploads/*' \
              -e "ssh -o StrictHostKeyChecking=no" \
              . \${DEPLOY_USER}@\${DEPLOY_HOST}:\${DEPLOY_DIR}/

            # Deploy sul server remoto
            ssh -o StrictHostKeyChecking=no \${DEPLOY_USER}@\${DEPLOY_HOST} << 'REMOTE'
              set -e
              cd /opt/metalmontaggi

              # Crea .env solo se non esiste
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
                echo "⚠️  ATTENZIONE: modifica /opt/metalmontaggi/.env con i valori reali!"
              fi

              echo "🐳 Build Docker images..."
              docker compose build --no-cache

              echo "🚀 Avvio stack..."
              docker compose up -d --remove-orphans

              echo "⏳ Attesa postgres healthy..."
              for i in $(seq 1 12); do
                STATUS=$(docker inspect --format='{{.State.Health.Status}}' metalmontaggi-postgres 2>/dev/null || echo missing)
                [ "$STATUS" = "healthy" ] && echo "✅ Postgres OK" && break
                echo "  ... ($i/12) $STATUS"
                sleep 5
              done

              echo ""
              echo "✅ Containers attivi:"
              docker compose ps
REMOTE

          """
        }
      }
    }

    // ── 3. Smoke Test ─────────────────────────────────────
    stage('Smoke Test') {
      steps {
        sshagent(credentials: ['deploy-server-ssh']) {
          sh """
            set -e
            DEPLOY_HOST=\${DEPLOY_HOST:-"CONFIGURA_IP_SERVER"}
            DEPLOY_USER=\${DEPLOY_USER:-"root"}

            echo "🔍 Test API Strapi..."
            for i in \$(seq 1 6); do
              HTTP=\$(ssh -o StrictHostKeyChecking=no \${DEPLOY_USER}@\${DEPLOY_HOST} \
                "curl -sk -o /dev/null -w '%{http_code}' http://localhost:1337/api/informazioni-azienda 2>/dev/null || echo 000")
              if [ "\$HTTP" = "200" ]; then
                echo "✅ Strapi API OK (HTTP 200)"
                break
              fi
              echo "  ... (\$i/6) HTTP \$HTTP — attesa..."
              sleep 10
            done

            echo "🔍 Test Frontend..."
            HTTP=\$(ssh -o StrictHostKeyChecking=no \${DEPLOY_USER}@\${DEPLOY_HOST} \
              "curl -sk -o /dev/null -w '%{http_code}' http://localhost:3000 2>/dev/null || echo 000")
            echo "Frontend HTTP: \$HTTP"
          """
        }
      }
    }
  }

  post {
    success {
      echo """
        ╔══════════════════════════════════════╗
        ║   ✅ DEPLOY COMPLETATO — Build #${BUILD_NUMBER}  ║
        ╚══════════════════════════════════════╝
        Branch: master | Commit: ${GIT_COMMIT?.take(7)}
      """
    }
    failure {
      echo "❌ DEPLOY FALLITO — Build #${BUILD_NUMBER} — controlla i log"
    }
    always {
      cleanWs()
    }
  }
}
