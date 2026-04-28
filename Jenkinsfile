pipeline {
  agent any

  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timestamps()
    timeout(time: 20, unit: 'MINUTES')
  }

  environment {
    GIT_REPO = 'https://github.com/Mattimax20/metalmontaggi.git'
    // Definisci in: Manage Jenkins → System → Global properties → Environment variables
    //   DEPLOY_HOST = IP o hostname del server (es. 185.1.2.3)
    //   DEPLOY_USER = utente SSH            (es. root)
    //   DEPLOY_DIR  = percorso sul server   (es. /opt/metalmontaggi)
  }

  stages {

    stage('Checkout') {
      steps {
        git branch: 'master', url: env.GIT_REPO
      }
    }

    stage('Deploy') {
      steps {
        withCredentials([sshUserPrivateKey(
          credentialsId: 'deploy-server-ssh',
          keyFileVariable: 'SSH_KEY'
        )]) {
          sh '''
            SSH="ssh -i $SSH_KEY -o StrictHostKeyChecking=no -o BatchMode=yes"
            RSYNC_SSH="ssh -i $SSH_KEY -o StrictHostKeyChecking=no"

            echo "→ Deploy su ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_DIR}"

            # Crea directory remota
            $SSH ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_DIR}"

            # Sincronizza sorgenti
            rsync -az --delete \
              --exclude='.git' \
              --exclude='node_modules' \
              --exclude='*/node_modules' \
              --exclude='.env' \
              --exclude='public/uploads/*' \
              -e "$RSYNC_SSH" \
              . ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_DIR}/

            # Esegui script di deploy remoto
            $SSH ${DEPLOY_USER}@${DEPLOY_HOST} \
              "chmod +x ${DEPLOY_DIR}/scripts/remote-deploy.sh && \
               ${DEPLOY_DIR}/scripts/remote-deploy.sh ${DEPLOY_DIR}"
          '''
        }
      }
    }

    stage('Smoke Test') {
      steps {
        withCredentials([sshUserPrivateKey(
          credentialsId: 'deploy-server-ssh',
          keyFileVariable: 'SSH_KEY'
        )]) {
          sh '''
            SSH="ssh -i $SSH_KEY -o StrictHostKeyChecking=no"

            echo "🔍 Test Strapi API..."
            for i in 1 2 3 4 5 6; do
              HTTP=$($SSH ${DEPLOY_USER}@${DEPLOY_HOST} \
                "curl -sk -o /dev/null -w '%{http_code}' http://localhost:1337/api/informazioni-azienda 2>/dev/null || echo 000")
              if [ "$HTTP" = "200" ]; then
                echo "✅ Strapi OK (HTTP 200)"
                break
              fi
              echo "  ... ($i/6) HTTP $HTTP — attesa 10s"
              sleep 10
            done

            echo "🔍 Test Frontend..."
            HTTP=$($SSH ${DEPLOY_USER}@${DEPLOY_HOST} \
              "curl -sk -o /dev/null -w '%{http_code}' http://localhost:3000 2>/dev/null || echo 000")
            if [ "$HTTP" = "200" ]; then
              echo "✅ Frontend OK (HTTP 200)"
            else
              echo "⚠️  Frontend risponde HTTP $HTTP"
            fi
          '''
        }
      }
    }
  }

  post {
    success {
      echo "✅ DEPLOY COMPLETATO — Build #${BUILD_NUMBER} — master"
    }
    failure {
      withCredentials([sshUserPrivateKey(
        credentialsId: 'deploy-server-ssh',
        keyFileVariable: 'SSH_KEY'
      )]) {
        sh '''
          SSH="ssh -i $SSH_KEY -o StrictHostKeyChecking=no"
          echo "❌ DEPLOY FALLITO — ultimi log Strapi:"
          $SSH ${DEPLOY_USER}@${DEPLOY_HOST} \
            "cd ${DEPLOY_DIR} && docker compose logs --tail=40 strapi 2>/dev/null || true" || true
        '''
      }
    }
    always {
      cleanWs()
    }
  }
}
