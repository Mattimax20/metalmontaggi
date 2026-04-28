pipeline {
  agent any

  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timestamps()
    timeout(time: 20, unit: 'MINUTES')
  }

  environment {
    GIT_REPO   = 'https://github.com/Mattimax20/metalmontaggi.git'
    // Definisci queste 3 variabili in:
    // Jenkins → Manage Jenkins → System → Global properties → Environment variables
    //   DEPLOY_HOST = IP o hostname del server (es. 1.2.3.4)
    //   DEPLOY_USER = utente SSH (es. root)
    //   DEPLOY_DIR  = cartella sul server (es. /opt/metalmontaggi)
  }

  stages {

    stage('Checkout') {
      steps {
        git branch: 'master', url: "${GIT_REPO}"
      }
    }

    stage('Deploy') {
      steps {
        sshagent(credentials: ['deploy-server-ssh']) {
          sh 'echo "→ Target: ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_DIR}"'

          // Crea directory remota
          sh 'ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_DIR}"'

          // Sincronizza sorgenti (esclude .env e node_modules)
          sh '''
            rsync -az --delete \
              --exclude='.git' \
              --exclude='node_modules' \
              --exclude='*/node_modules' \
              --exclude='.env' \
              --exclude='public/uploads/*' \
              -e "ssh -o StrictHostKeyChecking=no" \
              . ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_DIR}/
          '''

          // Rendi eseguibile lo script remoto e lancia il deploy
          sh 'ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} "chmod +x ${DEPLOY_DIR}/scripts/remote-deploy.sh && ${DEPLOY_DIR}/scripts/remote-deploy.sh ${DEPLOY_DIR}"'
        }
      }
    }

    stage('Smoke Test') {
      steps {
        sshagent(credentials: ['deploy-server-ssh']) {
          sh '''
            echo "🔍 Test Strapi API..."
            for i in 1 2 3 4 5 6; do
              HTTP=$(ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} \
                "curl -sk -o /dev/null -w '%{http_code}' http://localhost:1337/api/informazioni-azienda 2>/dev/null || echo 000")
              if [ "$HTTP" = "200" ]; then
                echo "✅ Strapi OK (HTTP 200)"
                break
              fi
              echo "  ... ($i/6) HTTP $HTTP — attesa 10s"
              sleep 10
            done

            echo "🔍 Test Frontend..."
            HTTP=$(ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} \
              "curl -sk -o /dev/null -w '%{http_code}' http://localhost:3000 2>/dev/null || echo 000")
            echo "Frontend HTTP: $HTTP"
            [ "$HTTP" = "200" ] && echo "✅ Frontend OK" || echo "⚠️  Frontend risponde $HTTP"
          '''
        }
      }
    }
  }

  post {
    success {
      echo "✅ DEPLOY COMPLETATO — Build #${BUILD_NUMBER} — branch master"
    }
    failure {
      sh '''
        echo "❌ DEPLOY FALLITO — log remoto:"
        ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} \
          "cd ${DEPLOY_DIR} && docker compose logs --tail=40 strapi 2>/dev/null || true" || true
      '''
    }
    always {
      cleanWs()
    }
  }
}
